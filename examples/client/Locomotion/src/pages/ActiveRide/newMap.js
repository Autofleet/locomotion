import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import polyline from '@mapbox/polyline';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Polygon, Polyline } from 'react-native-maps';
import Config from 'react-native-config';
import { RidePageContext } from '../../context/newRideContext';
import { RideStateContextContext } from '../../context';
import { getPosition } from '../../services/geo';
import { LocationMarker, LocationMarkerContainer } from './styled';
import mapDarkMode from '../../assets/mapDarkMode.json';
import { Context as ThemeContext, THEME_MOD } from '../../context/theme';
import { AvailabilityContext } from '../../context/availability';
import AvailabilityVehicle from '../../Components/AvailabilityVehicle';
import StationsMap from '../../Components/Marker';
import { latLngToAddress } from '../../context/newRideContext/utils';
import { BS_PAGES } from '../../context/ridePageStateContext/utils';
import { STOP_POINT_TYPES } from '../../lib/commonTypes';

const MAP_EDGE_PADDING = {
  top: 120,
  right: 100,
  bottom: 400,
  left: 100,
};
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

  const isMainPage = currentBsPage === BS_PAGES.ADDRESS_SELECTOR;
  const isConfirmPickupPage = currentBsPage === BS_PAGES.CONFIRM_PICKUP;
  const isChooseLocationOnMap = [BS_PAGES.CONFIRM_PICKUP, BS_PAGES.SET_LOCATION_ON_MAP].includes(currentBsPage);
  const {
    requestStopPoints, saveSelectedLocation, reverseLocationGeocode, ride,
  } = useContext(RidePageContext);
  const [rideStopPoints, setRideStopPoints] = useState();
  const [mapRegion, setMapRegion] = useState({
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const focusCurrentLocation = () => {
    if (mapRegion.longitude && mapRegion.latitude && ref.current) {
      ref.current.animateToRegion({
        latitude: mapRegion.latitude,
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
        ...geoData.coords,
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
    if (isUserLocationFocused) {
      focusCurrentLocation();
    }
  }, [mapRegion]);

  useEffect(() => {
    if (currentBsPage === BS_PAGES.CONFIRM_PICKUP) {
      const pickupStopPoint = requestStopPoints.find(sp => sp.type === STOP_POINT_TYPES.STOP_POINT_PICKUP);
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
    ref.current.fitToCoordinates(coordsToFit,
      {
        edgePadding: MAP_EDGE_PADDING,
      });
  };
  useEffect(() => {
    if (requestStopPoints.filter((sp => sp.lat)).length > 1) {
      showInputPointsOnMap();
    }
  }, [requestStopPoints]);

  const addStreetAddressToStopPoints = async () => {
    const formattedStopPoints = await Promise.all(ride.stopPoints.map(async (sp) => {
      const { streetAddress } = await reverseLocationGeocode(sp.lat, sp.lng);
      return {
        ...sp,
        streetAddress,
      };
    }));
    setRideStopPoints(formattedStopPoints);
  };

  useEffect(() => {
    if (ride && ride.stopPoints) {
      addStreetAddressToStopPoints();
    }
  }, [ride.stopPoints]);

  const stopPoints = rideStopPoints || requestStopPoints || [];
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
        onUserLocationChange={(event) => {
          if ((Platform.OS === 'ios' && !Config.MAP_PROVIDER !== 'google') || !isUserLocationFocused) {
            return; // Follow user location works for iOS
          }
          const { coordinate } = event.nativeEvent;

          setMapRegion(oldMapRegion => ({
            ...oldMapRegion,
            ...coordinate,
          }));

          if (isUserLocationFocused) {
            focusCurrentLocation();
          }
        }}
        ref={ref}
        userInterfaceStyle={isDarkMode ? THEME_MOD.DARK : undefined}
        customMapStyle={isDarkMode ? mapDarkMode : undefined}
        {...mapSettings}
      >
        {rideStopPoints && (
          <Polyline
            strokeColor={primaryColor}
            strokeWidth={7}
            coordinates={polyline.decode(ride.stopPoints[0].polyline)
              .map(tuple => ({ latitude: tuple[0], longitude: tuple[1] }))}
          />
        )}
        {!isConfirmPickupPage && stopPoints.filter(sp => !!sp.lat).length > 1
          ? stopPoints
            .filter(sp => !!sp.lat)
            .map(sp => (<StationsMap stopPoint={sp} key={sp.id} />))
          : null}
        {currentBsPage === BS_PAGES.NOT_IN_TERRITORY && territory && territory.length ? territory
          .map(t => t.polygon.coordinates.map(poly => (
            <Polygon
              key={`Polygon#${t.id}#${poly[1]}#${poly[0]}`}
              strokeWidth={2}
              strokeColor={`${primaryColor}`}
              fillColor={`${primaryColor}40`}
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
