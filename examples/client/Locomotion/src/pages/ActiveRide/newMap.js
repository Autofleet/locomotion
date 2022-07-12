import React, {
  useContext, useEffect, useState,
} from 'react';
import polyline from '@mapbox/polyline';
import { Platform, StyleSheet, Text } from 'react-native';
import MapView, { Polygon, Polyline } from 'react-native-maps';
import Config from 'react-native-config';
import { UserContext } from '../../context/user';
import { RidePageContext } from '../../context/newRideContext';
import { RideStateContextContext } from '../../context';
import { DEFAULT_COORDS, getPosition } from '../../services/geo';
import { LocationMarker, LocationMarkerContainer } from './styled';
import mapDarkMode from '../../assets/mapDarkMode.json';
import { Context as ThemeContext, THEME_MOD } from '../../context/theme';
import { AvailabilityContext } from '../../context/availability';
import AvailabilityVehicle from '../../Components/AvailabilityVehicle';
import StationsMap from '../../Components/Marker';
import { BS_PAGES } from '../../context/ridePageStateContext/utils';
import { RIDE_STATES, STOP_POINT_STATES, STOP_POINT_TYPES } from '../../lib/commonTypes';
import PrecedingStopPointMarker from '../../Components/PrecedingStopPointMarker';
import { getSubLineStringAfterLocationFromDecodedPolyline } from '../../lib/polyline/utils';
import { BottomSheetContext } from '../../context/bottomSheetContext';

const MAP_EDGE_PADDING = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
};

const PAGES_TO_SHOW_SP_MARKERS = [
  BS_PAGES.ADDRESS_SELECTOR,
  BS_PAGES.SERVICE_ESTIMATIONS,
  BS_PAGES.NO_PAYMENT,
  BS_PAGES.NOT_IN_TERRITORY,
  BS_PAGES.NO_AVAILABLE_VEHICLES,
  BS_PAGES.ACTIVE_RIDE,
  BS_PAGES.CANCEL_RIDE,
  BS_PAGES.CONFIRMING_RIDE,
];


const getFirstPendingStopPoint = sps => (sps || []).find(sp => sp.state
  === STOP_POINT_STATES.PENDING);

export default React.forwardRef(({
  mapSettings,
}, ref) => {
  const { isDarkMode, primaryColor } = useContext(ThemeContext);
  const {
    availabilityVehicles,
  } = useContext(AvailabilityContext);

  const {
    isUserLocationFocused,
    setIsUserLocationFocused,
    territory,
    currentBsPage,
    initGeoService,
  } = useContext(RideStateContextContext);
  const {
    snapPoints,
  } = useContext(BottomSheetContext);
  const isMainPage = currentBsPage === BS_PAGES.ADDRESS_SELECTOR;
  const isChooseLocationOnMap = [BS_PAGES.CONFIRM_PICKUP, BS_PAGES.SET_LOCATION_ON_MAP]
    .includes(currentBsPage);
  const {
    requestStopPoints, saveSelectedLocation, reverseLocationGeocode, ride,
    chosenService,
  } = useContext(RidePageContext);
  const [mapRegion, setMapRegion] = useState({
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const focusCurrentLocation = () => {
    if (mapRegion.longitude && mapRegion.latitude && ref.current) {
      ref.current.animateToRegion({
        latitude: mapRegion.latitude - parseFloat(snapPoints[0]) / 10000,
        longitude: mapRegion.longitude,
        latitudeDelta: mapRegion.latitudeDelta,
        longitudeDelta: mapRegion.longitudeDelta,
      }, 1000);
    }
  };

  const buildAvailabilityVehicles = () => (isMainPage ? availabilityVehicles.map(vehicle => (
    <AvailabilityVehicle
      location={vehicle.location}
      id={vehicle.id}
      key={vehicle.id}
    />
  )) : null);

  const initialLocation = async () => {
    try {
      const geoData = await getPosition();
      setMapRegion(oldMapRegion => ({
        ...oldMapRegion,
        ...(geoData || DEFAULT_COORDS).coords,
      }));
    } catch (e) {
      console.log('Init location error', e);
    }
  };

  const initLocation = async () => {
    await initGeoService();
    await initialLocation();
  };

  useEffect(() => {
    if (ref.current) {
      initLocation();
    }
  }, [ref.current]);

  useEffect(() => {
    if (currentBsPage === BS_PAGES.CONFIRM_PICKUP) {
      const [pickupStopPoint] = requestStopPoints;
      if (pickupStopPoint) {
        ref.current.fitToCoordinates([{
          latitude: pickupStopPoint.lat - 0.001,
          longitude: pickupStopPoint.lng - 0.001,
        }, {
          latitude: pickupStopPoint.lat,
          longitude: pickupStopPoint.lng,
        }, {
          latitude: pickupStopPoint.lat + 0.001,
          longitude: pickupStopPoint.lng + 0.001,
        }], {
          animated: false,
        });
      }
    }
  }, [currentBsPage]);

  const showInputPointsOnMap = () => {
    const coordsToFit = requestStopPoints
      .filter((sp => sp.lat))
      .map(sp => (
        {
          latitude: sp.lat - parseFloat(snapPoints[0]) / 10000,
          longitude: parseFloat(sp.lng),
        }
      ));
    if (coordsToFit.length > 0) {
      ref.current.fitToCoordinates(coordsToFit,
        {
          edgePadding: MAP_EDGE_PADDING,
        });
    }
  };

  useEffect(() => {
    if (requestStopPoints.filter((sp => sp.lat)).length > 1) {
      showInputPointsOnMap();
    }
  }, [requestStopPoints]);

  const { stopPoints } = ride;

  const currentStopPoint = getFirstPendingStopPoint(stopPoints);
  const precedingStopPoints = (currentStopPoint || {}).precedingStops || [];

  const polylineList = stopPoints && currentStopPoint
     && currentStopPoint.polyline && getSubLineStringAfterLocationFromDecodedPolyline(
    polyline.decode(currentStopPoint.polyline),
    { latitude: ride.vehicle.location.lat, longitude: ride.vehicle.location.lng },
  ).map(p => ({ latitude: p[0], longitude: p[1] }));

  const finalStopPoints = stopPoints || requestStopPoints;
  const firstSpNotCompleted = (stopPoints
    && stopPoints.find(p => p.state !== STOP_POINT_STATES.COMPLETED)) || requestStopPoints[0];

  return (
    <>
      <MapView
        provider={Config.MAP_PROVIDER}
        showsUserLocation={isMainPage}
        style={StyleSheet.absoluteFillObject}
        showsMyLocationButton={false}
        loadingEnabled
        showsCompass={false}
        key="map"
        followsUserLocation={isUserLocationFocused}
        moveOnMarkerPress={false}
        onRegionChangeComplete={async (event) => {
          if (isChooseLocationOnMap) {
            const { latitude, longitude } = event;
            const lat = latitude.toFixed(6);
            const lng = longitude.toFixed(6);
            const spData = await reverseLocationGeocode(lat, lng);
            saveSelectedLocation(spData);
          }
        }}
        onPanDrag={() => (
          !isUserLocationFocused === false ? setIsUserLocationFocused(false) : null
        )}
        ref={ref}
        userInterfaceStyle={isDarkMode ? THEME_MOD.DARK : undefined}
        customMapStyle={isDarkMode ? mapDarkMode : undefined}
        {...mapSettings}
      >
        {ride.vehicle && ride.vehicle.location && (
        <AvailabilityVehicle
          location={ride.vehicle.location}
          id={ride.vehicle.id}
          key={ride.vehicle.id}
        />
        )}
        {finalStopPoints && !!precedingStopPoints.length
          && precedingStopPoints.map(sp => <PrecedingStopPointMarker key={sp.id} stopPoint={sp} />)
        }
        {finalStopPoints && polylineList && (
          <Polyline
            strokeColor={primaryColor}
            strokeWidth={7}
            coordinates={polylineList}
          />
        )}
        {PAGES_TO_SHOW_SP_MARKERS.includes(currentBsPage)
          && finalStopPoints.filter(sp => !!sp.lat).length > 1
          ? finalStopPoints
            .filter(sp => !!sp.lat)
            .map(sp => (
              <StationsMap
                chosenService={chosenService}
                stopPoint={sp}
                key={sp.id}
                isNext={firstSpNotCompleted.id === sp.id}
              />
            ))
          : null}
        {currentBsPage === BS_PAGES.NOT_IN_TERRITORY && territory && territory.length ? territory
          .map(t => t.polygon.coordinates.map(poly => (
            <Polygon
              key={`Polygon#${t.id}#${poly[1]}#${poly[0]}`}
              strokeColor="transparent"
              fillColor="#26333333"
              coordinates={poly.map(p => (
                { latitude: parseFloat(p[1]), longitude: parseFloat(p[0]) }
              ))}
            />
          ))) : null}
        {buildAvailabilityVehicles()}
      </MapView>
      {isChooseLocationOnMap && (
        <LocationMarkerContainer pointerEvents="none">
          <LocationMarker />
        </LocationMarkerContainer>
      )}
    </>
  );
});
