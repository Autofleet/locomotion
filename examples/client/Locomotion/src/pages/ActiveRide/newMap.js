import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
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

const MAP_EDGE_PADDING = {
  top: 80,
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
  const mapInstance = useRef();

  const {
    isUserLocationFocused,
    setIsUserLocationFocused,
    territory,
    showOutOfTerritory,
    selectLocationMode,
    saveSelectedLocation,
  } = useContext(RideStateContextContext);

  const { requestStopPoints, chosenService } = useContext(RidePageContext);

  const [mapRegion, setMapRegion] = useState({
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const focusCurrentLocation = () => {
    if (mapRegion.longitude && mapRegion.latitude) {
      mapInstance.current.animateToRegion({
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude,
        latitudeDelta: mapRegion.latitudeDelta,
        longitudeDelta: mapRegion.longitudeDelta,
      }, 1000);
    }
  };

  const buildAvailabilityVehicles = () => availabilityVehicles.map(vehicle => (
    <AvailabilityVehicle
      location={vehicle.location}
      id={vehicle.id}
    />
  ));

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

  useEffect(() => {
    initialLocation();
  }, []);


  useEffect(() => {
    if (isUserLocationFocused) {
      focusCurrentLocation();
    }
  }, [mapRegion]);


  React.useImperativeHandle(ref, () => ({
    focusCurrentLocation,
  }));

  const showInputPointsOnMap = () => {
    const coordsToFit = requestStopPoints
      .filter((sp => sp.location))
      .map(sp => (
        {
          latitude: parseFloat(sp.location.lat),
          longitude: parseFloat(sp.location.lng),
        }
      ));
    mapInstance.current.fitToCoordinates(coordsToFit,
      {
        edgePadding: MAP_EDGE_PADDING,
      });
  };
  useEffect(() => {
    if (requestStopPoints.filter((sp => sp.location)).length > 1) {
      showInputPointsOnMap();
    }
  }, [requestStopPoints]);

  return (
    <>
      <MapView
        provider={Config.MAP_PROVIDER}
        showsUserLocation
        style={StyleSheet.absoluteFillObject}
        showsMyLocationButton={false}
        loadingEnabled
        showsCompass={false}
        key="map"
        followsUserLocation={isUserLocationFocused}
        moveOnMarkerPress={false}
        onRegionChange={(event) => {
          if (selectLocationMode) {
            const { latitude, longitude } = event;
            saveSelectedLocation({
              latitude: latitude.toFixed(6),
              longitude: longitude.toFixed(6),
            });
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
        ref={mapInstance}
        userInterfaceStyle={isDarkMode ? THEME_MOD.DARK : undefined}
        customMapStyle={isDarkMode ? mapDarkMode : undefined}
        {...mapSettings}
      >
        {chosenService && requestStopPoints.filter(sp => !!sp.location).length > 1
          ? requestStopPoints
            .filter(sp => !!sp.location)
            .map(sp => (<StationsMap stopPoint={sp} />))
          : null}
        {showOutOfTerritory && territory && territory.length ? territory
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
      {selectLocationMode && (
        <LocationMarkerContainer pointerEvents="none">
          <LocationMarker />
        </LocationMarkerContainer>
      )}
    </>
  );
});
