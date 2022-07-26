import React, {
  useCallback,
  useContext, useEffect, useState,
} from 'react';
import polyline from '@mapbox/polyline';
import { StyleSheet } from 'react-native';
import MapView, { Polygon, Polyline } from 'react-native-maps';
import Config from 'react-native-config';
import moment from 'moment';
import { debounce } from 'lodash';
import { FutureRidesContext } from '../../context/futureRides';
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
import { STOP_POINT_STATES } from '../../lib/commonTypes';
import PrecedingStopPointMarker from '../../Components/PrecedingStopPointMarker';
import { getSubLineStringAfterLocationFromDecodedPolyline } from '../../lib/polyline/utils';
import { BottomSheetContext } from '../../context/bottomSheetContext';
import i18n from '../../I18n';

const MAP_EDGE_PADDING = {
  top: 140,
  right: 100,
  bottom: 400,
  left: 100,
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
  BS_PAGES.CONFIRM_FUTURE_RIDE,
];

const PAGES_TO_SHOW_MY_LOCATION = [
  BS_PAGES.ADDRESS_SELECTOR,
  BS_PAGES.SERVICE_ESTIMATIONS,
  BS_PAGES.NOT_IN_TERRITORY,
  BS_PAGES.ACTIVE_RIDE,
  BS_PAGES.CANCEL_RIDE,
  BS_PAGES.CONFIRM_FUTURE_RIDE,
  BS_PAGES.SET_LOCATION_ON_MAP,
  BS_PAGES.CONFIRM_PICKUP,
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
  const {
    newFutureRide,
  } = useContext(FutureRidesContext);
  const [mapRegion, setMapRegion] = useState({
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const focusMapToCoordinates = (coords, animated, padding = {}) => {
    ref.current.fitToCoordinates(coords, {
      animated,
      edgePadding: padding,
    });
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
        ref.current.animateToRegion({
          latitude: pickupStopPoint.lat,
          longitude: pickupStopPoint.lng,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }, 1000);
      }
    }
    if (currentBsPage === BS_PAGES.CONFIRM_FUTURE_RIDE) {
      focusMapToCoordinates(newFutureRide.stopPoints.map(sp => ({
        latitude: sp.lat,
        longitude: sp.lng,
      })), false, MAP_EDGE_PADDING);
    }
  }, [currentBsPage]);

  const showInputPointsOnMap = () => {
    const coordsToFit = requestStopPoints
      .filter((sp => sp.lat))
      .map(sp => (
        {
          latitude: parseFloat(sp.lat),
          longitude: parseFloat(sp.lng),
        }
      ));
    if (coordsToFit.length > 0) {
      focusMapToCoordinates(coordsToFit, false, MAP_EDGE_PADDING);
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


  const getStopPointEtaText = (stopPoint, isNext) => {
    const { state } = stopPoint;
    if (state === STOP_POINT_STATES.COMPLETED) {
      return i18n.t('stopPoints.states.completed');
    }

    if (isNext) {
      if (ride.scheduledTo) {
        return moment(ride.scheduledTo).format('MMM D, h:mm A');
      }
      const eta = stopPoint.plannedArrivalTime || (chosenService && chosenService.eta);
      if (eta) {
        const minutesUntilPickup = moment(eta).diff(moment(), 'minutes');
        return minutesUntilPickup < 1
          ? i18n.t('general.now')
          : i18n.t('rideDetails.toolTipEta', { minutes: minutesUntilPickup });
      }
    }

    if (stopPoint.plannedArrivalTime) {
      return moment(stopPoint.plannedArrivalTime).format('h:mm A');
    }

    return stopPoint.streetAddress || stopPoint.description;
  };

  const debouncedSaveLocation = debounce(async ({ latitude, longitude }) => {
    const lat = latitude.toFixed(6);
    const lng = longitude.toFixed(6);
    const spData = await reverseLocationGeocode(lat, lng);
    saveSelectedLocation(spData);
  }, 300);

  return (
    <>
      <MapView
        provider={Config.MAP_PROVIDER}
        showsUserLocation={PAGES_TO_SHOW_MY_LOCATION.includes(currentBsPage)}
        style={StyleSheet.absoluteFillObject}
        showsMyLocationButton={false}
        loadingEnabled
        showsCompass={false}
        key="map"
        followsUserLocation={isUserLocationFocused}
        moveOnMarkerPress={false}
        onPanDrag={({ nativeEvent: { coordinate: { latitude, longitude } } }) => {
          if (!isUserLocationFocused === false) {
            setIsUserLocationFocused(false);
          }
          if (isChooseLocationOnMap) {
            debouncedSaveLocation({ latitude, longitude });
          }
        }}
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
            strokeWidth={5}
            coordinates={polylineList}
          />
        )}
        {PAGES_TO_SHOW_SP_MARKERS.includes(currentBsPage)
          && finalStopPoints.filter(sp => !!sp.lat).length > 1
          ? finalStopPoints
            .filter(sp => !!sp.lat)
            .map((sp) => {
              const isNext = firstSpNotCompleted.id === sp.id;
              return (
                <StationsMap
                  stopPoint={sp}
                  key={sp.id}
                  isNext={isNext}
                  etaText={getStopPointEtaText(sp, isNext)}
                  isFutureRide={ride.scheduledTo}
                />
              );
            })
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
