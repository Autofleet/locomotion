import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Marker, Polygon, Polyline } from 'react-native-maps';
import Config from 'react-native-config';
import CheapRuler from 'cheap-ruler';
import { RidePageContext as NewRidePageContext } from '../../context/newRideContext';

import { RideStateContextContext, RidePageContext } from '../../context';
import { getPosition } from '../../services/geo';
import { VehicleDot } from './styled';
import mapDarkMode from '../../assets/mapDarkMode.json';
import { Context as ThemeContext, THEME_MOD } from '../../context/theme';
import StationsMap from './StationsMap';
import MyLocationButton from '../../Components/ShowMyLocationButton';
import AvailabilityContextProvider, { AvailabilityContext } from '../../context/availability';
import AvailabilityVehicle from '../../Components/AvailabilityVehicle';

const MAP_EDGE_PADDING = {
  top: 80,
  right: 100,
  bottom: 250,
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
    disableAutoLocationFocus,
    setDisableAutoLocationFocus,
    activeRideState,
    activeSpState,
    displayMatchInfo,
  } = useContext(RidePageContext);
  const {
    territory,
    showOutOfTerritory,
  } = useContext(RideStateContextContext);

  const { requestStopPoints: newRequestStopPoints } = useContext(NewRidePageContext);

  const [mapRegion, setMapRegion] = useState({
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const showsUserLocation = !activeRideState || (activeRideState && !activeRideState.stopPoints[0].completedAt);

  const focusMarkers = () => {
    if (!activeRideState) {
      return;
    }
    const activeSp = activeRideState.stopPoints.find(sp => sp.state === 'pending' || sp.state === 'arrived');

    const additional = [];
    if (activeRideState && activeSp.type === 'pickup' && !activeSp.completedAt && mapRegion.latitude && mapRegion.longitude) {
      additional.push({ latitude: mapRegion.latitude, longitude: mapRegion.longitude });
    }

    if (activeRideState.vehicle && activeRideState.vehicle.location && displayMatchInfo) {
      additional.push({
        latitude: parseFloat(activeRideState.vehicle.location.lat),
        longitude: parseFloat(activeRideState.vehicle.location.lng),
      });
    }

    mapInstance.current.fitToCoordinates([
      { latitude: parseFloat(activeSp.lat), longitude: parseFloat(activeSp.lng) },
      ...additional,
    ], {
      edgePadding: MAP_EDGE_PADDING,
    });
  };

  const focusCurrentLocation = () => {
    setDisableAutoLocationFocus(false);
    if (mapRegion.longitude && mapRegion.latitude && !activeRideState) {
      mapInstance.current.animateToRegion({
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude,
        latitudeDelta: mapRegion.latitudeDelta,
        longitudeDelta: mapRegion.longitudeDelta,
      }, 1000);
    } else if (activeRideState && activeRideState.vehicle && activeRideState.vehicle.location) {
      focusMarkers();
    }
  };

  const VehicleMarker = () => {
    if (activeRideState && activeRideState.vehicle && activeRideState.vehicle.location && displayMatchInfo) {
      let newPoint;
      const { lat, lng } = activeRideState.vehicle.location;
      const fixLat = Number(Number(lat).toFixed(5));
      const fixLng = Number(Number(lng).toFixed(5));
      if (activeSpState && activeSpState.polyline) {
        const ruler = new CheapRuler(fixLat, 'meters');
        const line = activeSpState.polyline.map(t => [t.longitude, t.latitude]);
        newPoint = ruler.pointOnLine(
          line,
          [fixLng, fixLat],
        ).point;
      } else {
        newPoint = [fixLat, fixLng];
      }
      return (
          <Marker coordinate={{ latitude: newPoint[1], longitude: newPoint[0] }}>
            <VehicleDot />
          </Marker>
      );
    }
    return null;
  };

  const buildAvailabilityVehicles = () => availabilityVehicles.map(vehicle => (
        <AvailabilityVehicle
          location={vehicle.location}
          id={vehicle.id}
        />));

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


  //   useEffect(() => {
  //     if (!disableAutoLocationFocus) {
  //       focusCurrentLocation();
  //     }
  //   }, [mapRegion]);


  //   React.useImperativeHandle(ref, () => ({
  //     focusCurrentLocation,
  //   }));

  const showInputPointsOnMap = () => {
    const coordsToFit = newRequestStopPoints
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
    if (newRequestStopPoints.filter((sp => sp.location)).length > 1) {
      showInputPointsOnMap();
    }
  }, [newRequestStopPoints]);

  return (
    <>
        <MapView
          provider={Config.MAP_PROVIDER}
          showsUserLocation={showsUserLocation}
          style={StyleSheet.absoluteFillObject}
          showsMyLocationButton={false}
          loadingEnabled
          showsCompass={false}
          key="map"
          followsUserLocation={!disableAutoLocationFocus}
          moveOnMarkerPress={false}
          onPanDrag={() => (
            disableAutoLocationFocus === false
              ? setDisableAutoLocationFocus(true)
              : null)}
          onUserLocationChange={(event) => {
            if ((Platform.OS === 'ios' && !Config.MAP_PROVIDER !== 'google') || !showsUserLocation || disableAutoLocationFocus) {
              return; // Follow user location works for iOS
            }
            const { coordinate } = event.nativeEvent;

            setMapRegion(oldMapRegion => ({
              ...oldMapRegion,
              ...coordinate,
            }));

            if (!disableAutoLocationFocus) {
              console.log('focusCurrentLocation');
              focusCurrentLocation();
            }
          }}
          ref={mapInstance}
          userInterfaceStyle={isDarkMode ? THEME_MOD.DARK : undefined}
          customMapStyle={isDarkMode ? mapDarkMode : undefined}
          {...mapSettings}
        >

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
          <VehicleMarker />
          {buildAvailabilityVehicles()}
        </MapView>
    </>
  );
});
