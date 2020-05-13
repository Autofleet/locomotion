import React, {
  useState, useEffect, useRef,
} from 'react';
import {
  StyleSheet, PermissionsAndroid, Platform, Image,
} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import polyline from '@mapbox/polyline';
import moment from 'moment';
import Config from 'react-native-config';

import network from '../../services/network';
import getPosition from './RideDrawer/StopPointsCard/AddressView/getPostion';
import {
  PageContainer, StopPointDot, VehicleDot, MapButtonsContainer,
} from './styled';
import Header from '../../Components/Header';
import RideDrawer from './RideDrawer';
import { getTogglePopupsState } from '../../context/main';
import UserService from '../../services/user';
import OneSignal from '../../services/one-signal';
import settingsContext from '../../context/settings';
import StationsMap from './StationsMap';
import MyLocationButton from './ShowMyLocationButton';
import RideSummaryPopup from '../../popups/RideSummaryPopup';
import FutureRideCanceledPopup from '../../popups/FutureRideCanceled';


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

export default ({ navigation, menuSide, mapSettings }) => {
  const [activeRideState, setActiveRide] = useState(null);
  const [futureRides, setFutureRides] = useState(null);

  const [preRideDetails, setPreRideDetails] = useState({});
  const [mapMarkers, setMapMarkers] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [activeSpState, setActiveSp] = useState(null);
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);
  const [stopPoints, setStopPoints] = useState(null);
  const [, togglePopup] = getTogglePopupsState();
  const [requestStopPoints, setRequestStopPoints] = useState({
    openEdit: false,
    selectedType: 'pickup',
    scheduledTo: null,
  });
  const [rideType, setRideType] = useState('pool');
  const [pickupEta, setPickupEta] = useState(null);
  const [displayMatchInfo, setDisplayMatchInfo] = useState(false);
  const [rideOffer, setRideOffer] = useState(null);
  const [offerExpired, setOfferExpired] = useState(false);
  const [offerTimer, setOfferTimer] = useState(false);
  const [stations, setStations] = useState([]);
  const [disableAutoLocationFocus, setDisableAutoLocationFocus] = useState(false);
  const [rideSummaryData, setRideSummaryData] = useState({});

  const mapInstance = useRef();
  const notificationsHandler = {
    futureRideCanceled: () => {
      togglePopup('futureRideCanceled', true);
    }
  }
  const loadActiveRide = async () => {
    const { data: response } = await network.get('api/v1/me/rides/active', { params: { activeRide: true } });
    const { ride: activeRide, futureRides: futureRidesData } = response;
    setFutureRides(futureRidesData);
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
            mapInstance.current.fitToElements(true);
          }, 500);
        }
      }

      return setActiveRide(activeRide);
    }

    if (activeRideState && activeRideState.stop_points[0].completed_at) {
      const { data: rideSummary } = await network.get('api/v1/me/rides/ride-summary', { params: { rideId: activeRideState.external_id } });

      const pickupTime = rideSummary.stop_points[0].completed_at;
      const dropoffTime = rideSummary.stop_points[1].completed_at;
      const distance = rideSummary.stop_points[1].actual_distance;
      const duration = moment(dropoffTime).diff(moment(pickupTime), 'minutes');

      setRideSummaryData({
        rideId: activeRideState.external_id,
        pickupTime,
        dropoffTime,
        distance,
        duration,
      });

      // Ride completed
      togglePopup('rideSummary', true);
      getStations();

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

  if(Config.STATIONS_REFRESH_RATE) {
    useInterval(() => {
      getStations();
    }, Config.STATIONS_REFRESH_RATE * 60000);
  }

  useEffect(() => {
    UserService.getUser(navigation);
    getStations();
    loadActiveRide();
    initialLocation();
    OneSignal.init(notificationsHandler);
  }, []);

  useInterval(() => {
    UserService.getUser(navigation);
  }, 10000);

  useEffect(() => {
    if (!activeRideState) {
      return;
    }
    const origin = activeRideState.stop_points[0];
    calculatePickupEta(origin);
  }, [activeRideState]);

  const bookValidation = state => {
    return state && state.dropoff && state.dropoff.lat
      && state.pickup && state.pickup.lat;
  }

  const loadPreRideDetails = async (origin, destination) => {
    return;
    try {
      const { data } = await network.get('api/v1/me/rides/pre', { params: { origin, destination } });
      setPreRideDetails(data);
    } catch (error) {
      console.log('Got error while try to get pre detail on a ride', error);
    }
  };

  const onLocationSelect = (location) => {
    const newState = {
      ...requestStopPoints,
      [location.type]: location,
      openEdit: false,
    };
    const bookValid = bookValidation(newState);

    if (bookValid) {
      loadPreRideDetails(newState.pickup, newState.dropoff);
    }

    setRequestStopPoints(newState);
  };

  const openLocationSelect = (type) => {
    if (activeRideState && activeRideState.vehicle) {
      return;
    }
    const newState = {
      ...requestStopPoints,
      selectedType: type,
    };

    if (requestStopPoints.selectedType === type) {
      newState.openEdit = true;
    }

    setRequestStopPoints(newState);
  };

  const createRide = async () => {
    clearTimeout(offerTimer);

    const { data: response } = await network.post('api/v1/me/rides', {
      pickupAddress: requestStopPoints.pickup.description,
      pickupLat: requestStopPoints.pickup.lat,
      pickupLng: requestStopPoints.pickup.lng,
      dropoffAddress: requestStopPoints.dropoff.description,
      dropoffLat: requestStopPoints.dropoff.lat,
      dropoffLng: requestStopPoints.dropoff.lng,
      numberOfPassengers,
      rideType,
      scheduledTo: requestStopPoints.scheduledTo,
    });

    if (response.state === 'rejected') {
      setRideOffer(null);
      togglePopup('rideRejected', true);
    } else {
      setTimeout(async () => {
        await loadActiveRide();
        setRideOffer(null);
      }, 2500);
    }
  };

  const createOffer = async () => {
    try {
      const { data: response } = await network.post('api/v1/me/rides/offer', {
        pickupAddress: requestStopPoints.pickup.description,
        pickupLat: requestStopPoints.pickup.lat,
        pickupLng: requestStopPoints.pickup.lng,
        dropoffAddress: requestStopPoints.dropoff.description,
        dropoffLat: requestStopPoints.dropoff.lat,
        dropoffLng: requestStopPoints.dropoff.lng,
        numberOfPassengers,
        rideType,
      });

      if (response.status === 'rejected') {
        togglePopup('rideRejected', true);
      } else {
        setRideOffer(response);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const cancelRide = async () => {
    await network.post('api/v1/me/rides/cancel-active-ride');
    return loadActiveRide();
  };

  const cancelOffer = () => {
    setRideOffer(null);
  };


  const calculatePickupEta = (origin) => {
    if (origin.completed_at) {
      setDisplayMatchInfo(true);
    } else if (origin && origin.eta) {
      const etaDiff = moment(origin.eta).diff(moment(), 'minutes');
      setPickupEta(etaDiff);
      setDisplayMatchInfo(etaDiff <= useSettings.settingsList.ARRIVE_REMINDER_MIN);
    }
  };

  const showsUserLocation = !activeRideState || !activeRideState.vehicle;
  const useSettings = settingsContext.useContainer();

  const setClosestStations = async (pickupStation) => {
    setRequestStopPoints({
      openEdit: false,
      pickup: pickupStation,
      selectedType: 'dropoff',
    });
  };

  const getStations = async () => {
    try {
      const { coords } = await getPosition();
      const { data } = await network.get('api/v1/me/places', {
        params: {
          location: { lat: coords.latitude, lng: coords.longitude },
          stations: true,
        },
      });
      setStations(data);
    } catch (error) {
      console.warn('Error while try to get current place', error.stack || error);
    }
  };

  useEffect(() => {
    if (stations.length) {
      setClosestStations(stations[0]);
      const markersList = stations.map(station => ({
        ...station,
        id: `${station.lat}-${station.lng}`,
      }));

      setMapMarkers(markersList);
    }
  }, [stations]);

  const selectStationMarker = (key) => {
    const station = mapMarkers.find(marker => marker.id === key);
    setRequestStopPoints({
      ...requestStopPoints,
      openEdit: false,
      [requestStopPoints.selectedType]: station,
    });
  };

  useEffect(() => {
    let offerTimeout;
    if (rideOffer) {
      setOfferExpired(false);
      setOfferTimer(setTimeout(() => {
        setOfferExpired(true);
      }, useSettings.settingsList.OFFER_EXPIRATION_TIME * 1000));
    } else {
      clearTimeout(offerTimer);
    }
  }, [rideOffer]);

  const initialLocation = async () => {
    const { coords } = await getPosition();
    setMapRegion(oldMapRegion => ({
      ...oldMapRegion,
      ...coords,
    }));
  };

  const closeAddressViewer = () => {
    setRequestStopPoints({
      ...requestStopPoints,
      openEdit: false,
    });
  };

  const onRating = async (rating) => {
    const response = await network.post('api/v1/me/rides/rating', {
      externalId: rideSummaryData.rideId,
      rating,
    });

    return response;
  };

  const focusCurrentLocation = () => {
    if(mapRegion.longitude && mapRegion.latitude) {
      mapInstance.current.animateToRegion({
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude,
        latitudeDelta: mapRegion.latitudeDelta,
        longitudeDelta: mapRegion.longitudeDelta,
      }, 1000);
    } else {
      setTimeout(() => {
        focusCurrentLocation();
      }, 1000)
    }
  };

  const onRideSchedule = (rideTime) => {
    const newState = {
      ...requestStopPoints,
      scheduledTo: rideTime,
    };
    setRequestStopPoints(newState);
  };

  const cancelFutureRide = async (rideId) => {
    const response = await network.post('api/v1/me/rides/cancel-future-ride', { rideId });
    loadActiveRide()
  };

  const createFutureOffer = async () => {
    const offerData = {
      numberOfPassengers
    }
    setRideOffer(offerData);
  };

  return (
    <PageContainer>
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
        onPanDrag={() => (disableAutoLocationFocus === false ? setDisableAutoLocationFocus(true) : null)}
        onUserLocationChange={(event) => {
          if ((Platform.OS === 'ios' && !Config.MAP_PROVIDER !== 'google') || !showsUserLocation || disableAutoLocationFocus) {
            return; // Follow user location works for iOS
          }
          const { coordinate } = event.nativeEvent;
          mapInstance.current.animateToRegion({
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
            latitudeDelta: mapRegion.latitudeDelta,
            longitudeDelta: mapRegion.longitudeDelta,
          }, 1000);

          setMapRegion(oldMapRegion => ({
            ...oldMapRegion,
            ...coordinate,
          }));
        }}
        ref={mapInstance}
        onMapReady={() => {
          focusCurrentLocation();
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
        }}
        {...mapSettings}
      >
        {!activeRideState
          ? (
            <StationsMap
              isInOffer={!!rideOffer}
              markersMap={mapMarkers}
              selectStation={selectStationMarker}
              requestStopPoints={requestStopPoints}
              activeRideState={activeRideState}
            />
          ) : null}

        {activeSpState && displayMatchInfo
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
        {activeRideState && activeRideState.vehicle && activeRideState.vehicle.location && displayMatchInfo
          ? (
            <Marker
              coordinate={{ latitude: activeRideState.vehicle.location.lat, longitude: activeRideState.vehicle.location.lng }}
            >
              <VehicleDot />
            </Marker>
          ) : null}
      </MapView>
      <MapButtonsContainer>
        <MyLocationButton
          onPress={() => focusCurrentLocation()}
          displayButton={showsUserLocation}
        />
      </MapButtonsContainer>
      <Header navigation={navigation} menuSide={menuSide} />
      <RideDrawer
        createRide={createRide}
        cancelRide={cancelRide}
        createOffer={createOffer}
        readyToBook={bookValidation(requestStopPoints)}
        openLocationSelect={openLocationSelect}
        requestStopPoints={requestStopPoints}
        activeRide={activeRideState}
        rideType={rideType}
        setRideType={setRideType}
        preRideDetails={preRideDetails}
        onNumberOfPassengerChange={setNumberOfPassengers}
        numberOfPassenger={numberOfPassengers}
        rideOffer={rideOffer}
        cancelOffer={cancelOffer}
        offerExpired={offerExpired}
        onLocationSelect={onLocationSelect}
        closeAddressViewer={closeAddressViewer}
        onRideSchedule={onRideSchedule}
        futureRides={futureRides}
        cancelFutureRide={cancelFutureRide}
        createFutureOffer={createFutureOffer}
      />
      <RideSummaryPopup rideSummaryData={rideSummaryData} onRating={onRating} onClose={() => setRideSummaryData({})} />
      <FutureRideCanceledPopup onClose={() => {}} />

    </PageContainer>
  );
};
