import React, {
  useState, useEffect, useRef,
} from 'react';
import {
  StyleSheet,
} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import polyline from '@mapbox/polyline';

import network from '../../services/network';
import AddressView from './AddressView';
import {
  PageContainer, StopPointDot, VehicleDot,
} from './styled';
import Header from '../../Components/Header';
import RideDrawer from './RideDrawer';
import { getTogglePopupsState } from '../../context/main';


function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default ({ navigation }) => {
  const [activeRideState, setActiveRide] = useState(null);
  const [activeSpState, setActiveSp] = useState(null);
  const [stopPoints, setStopPoints] = useState(null);
  const [, togglePopup] = getTogglePopupsState();
  const [requestStopPoints, setRequestStopPoints] = useState({
    openEdit: false,
    // pickup: {
    //   description: 'My location',
    //   lat: 32.070100,
    //   lng: 34.763717,
    // }
  });

  const loadActiveRide = async () => {
    const { data: response } = await network.get('api/v1/me/rides/active', { params: { activeRide: true } });
    const activeRide = response.ride;
    if (activeRide) {
      const [pickup, dropoff] = activeRide.stop_points;
      setStopPoints({
        pickup,
        dropoff,
      });
      let activeSp = activeRide.stop_points.find(sp => sp.state === 'pending');
      if (activeSp && activeSp.polyline) {
        activeSp = {
          ...activeSp,
          polyline: polyline.decode(activeSp.polyline)
            .map(tuple => ({ latitude: tuple[0], longitude: tuple[1] })),
        };
        setActiveSp(activeSp);
        if (!activeRideState || activeRideState.state !== activeRide.state
          || activeSp.id !== activeSpState.id) {
          setTimeout(() => {
            this.map.fitToElements(true);
          }, 500);
        }
      }
      return setActiveRide(activeRide);
    }

    if (activeRideState && activeRideState.stop_points[0].completed_at) {
      // Ride completed
      togglePopup('rideOver', true);
    }
    if (activeRideState && !activeRideState.stop_points[0].completed_at) {
      // Ride canceled
      togglePopup('rideCancel', true);
    }
    setActiveSp(null);
    setStopPoints(null);
    return setActiveRide(null);
  };

  useInterval(() => {
    loadActiveRide();
  }, 5000);

  useEffect(() => {
    loadActiveRide();
  }, []);

  const bookValidation = state => state
    && state.dropoff && state.dropoff.lat
    && state.pickup && state.pickup.lat;

  const onLocationSelect = (location) => {
    const newState = {
      ...requestStopPoints,
      [location.type]: location,
    };
    newState.openEdit = !bookValidation(newState);
    setRequestStopPoints(newState);
  };

  const openLocationSelect = () => {
    if (activeRideState && activeRideState.vehicle) {
      return;
    }
    const newState = {
      ...requestStopPoints,
      openEdit: true,
    };
    setRequestStopPoints(newState);
  };

  const createRide = async () => {
    const { data: response } = await network.post('api/v1/me/rides', {
      pickupAddress: requestStopPoints.pickup.description,
      pickupLat: requestStopPoints.pickup.lat,
      pickupLng: requestStopPoints.pickup.lng,
      dropoffAddress: requestStopPoints.dropoff.description,
      dropoffLat: requestStopPoints.dropoff.lat,
      dropoffLng: requestStopPoints.dropoff.lng,
    });
    if (response.state === 'rejected') {
      togglePopup('rideRejected', true);
    } else {
      return loadActiveRide();
    }
  };

  const cancelRide = async () => {
    await network.post('api/v1/me/rides/cancel-active-ride');
    return loadActiveRide();
  };

  return (
    <PageContainer>
      <MapView
        style={StyleSheet.absoluteFillObject}
        followsUserLocation
        showsMyLocationButton
        showsUserLocation={!activeRideState || !activeRideState.vehicle}
        ref={ref => this.map = ref}
      >
        {activeSpState
          ? (
            <Polyline
              strokeWidth={3}
              strokeColor="#8ac1ff"
              coordinates={activeSpState.polyline}
            />
          ) : null}
        {activeSpState
          ? (
            <Marker
              coordinate={activeSpState.polyline[activeSpState.polyline.length - 1]}
            >
              <StopPointDot />

            </Marker>
          ) : null}
        {activeRideState && activeRideState.vehicle && activeRideState.vehicle.location
          ? (
            <Marker
              coordinate={{ latitude: activeRideState.vehicle.location.lat, longitude: activeRideState.vehicle.location.lng }}
            >
              <VehicleDot />
            </Marker>
          ) : null}
      </MapView>
      <Header navigation={navigation} />
      <RideDrawer
        createRide={createRide}
        cancelRide={cancelRide}
        readyToBook={bookValidation(requestStopPoints)}
        openLocationSelect={openLocationSelect}
        requestStopPoints={requestStopPoints}
        activeRide={activeRideState}
      />
      {
          requestStopPoints.openEdit
            ? <AddressView onLocationSelect={onLocationSelect} requestStopPoints={requestStopPoints} />
            : null
        }
    </PageContainer>
  );
};
