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
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
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
      const [pickup, dropoff] = activeRide.stopPoints;
      setStopPoints({
        pickup,
        dropoff,
      });
      let activeSp = activeRide.stopPoints.find(sp => sp.state === 'pending');
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

    if (activeRideState && activeRideState.stopPoints[0].completedAt) {
      const { data: rideSummary } = await network.get('api/v1/me/rides/ride-summary', { params: { rideId: activeRideState.externalId } });

      const pickupTime = rideSummary.stopPoints[0].completedAt;
      const dropoffTime = rideSummary.stopPoints[1].completedAt;
      const distance = rideSummary.stopPoints[1].actualDistance;
      const duration = moment(dropoffTime).diff(moment(pickupTime), 'minutes');

      setRideSummaryData({
        rideId: activeRideState.externalId,
        pickupTime,
        dropoffTime,
        distance,
        duration,
      });

      // Ride completed
      togglePopup('rideSummary', true);
      getStations();

    }
    if (activeRideState && !activeRideState.stopPoints[0].completedAt) {
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
      if(!rideOffer) {
        getStations();
      }
    }, Config.STATIONS_REFRESH_RATE * 60000);
  }

  useEffect(() => {
    initialLocation();
    UserService.getUser(navigation);
    getStations();
    loadActiveRide();
    OneSignal.init(notificationsHandler);
  }, []);

  useInterval(() => {
    UserService.getUser(navigation);
  }, 10000);

  useEffect(() => {
    if (!activeRideState) {
      return;
    }
    const origin = activeRideState.stopPoints[0];
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
      numberOfPassengers,
      rideType,
      scheduledTo: requestStopPoints.scheduledTo,
      stopPoints:[
         {
          type: 'pickup',
          address: requestStopPoints.pickup.description,
          lat: requestStopPoints.pickup.lat,
          lng: requestStopPoints.pickup.lng,
        },
        {
          type: 'dropoff',
          address: requestStopPoints.dropoff.description,
          lat: requestStopPoints.dropoff.lat,
          lng: requestStopPoints.dropoff.lng,


        },
      ]
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
    if (origin.completeAt) {
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
    let lat = mapRegion.latitude || parseFloat(Config.DEFAULT_LATITUDE)
    let lng = mapRegion.longitude || parseFloat(Config.DEFAULT_LONGITUDE);

    if(Platform.OS !== 'ios') {
      const locationPermissionCoarse = await PermissionsAndroid.check('android.permission.ACCESS_COARSE_LOCATION')
      const locationPermissionFine = await PermissionsAndroid.check('android.permission.ACCESS_FINE_LOCATION')

      if(locationPermissionCoarse || locationPermissionFine) {
        try {
          const { coords } = await getPosition();
          if(coords.latitude && coords.longitude) {
            lat = coords.latitude
            lng = coords.longitude
          }
        } catch (e) {
          console.log('Error get position', e);
        }
      }
    }

    const { data } = await network.get('api/v1/me/places', {
      params: {
        location: { lat, lng },
        stations: true,
      },
    });

    setStations(data);
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
    try {
      const geoData = await getPosition();
      setMapRegion(oldMapRegion => ({
        ...oldMapRegion,
        ...geoData.coords,
      }));
    } catch (e) {
      console.log('Init location error', e);

      if(Config.DEFAULT_LATITUDE && Config.DEFAULT_LONGITUDE) {
        setMapRegion(oldMapRegion => ({
          ...oldMapRegion,
          latitude: parseFloat(Config.DEFAULT_LATITUDE),
          longitude: parseFloat(Config.DEFAULT_LONGITUDE)
        }));
      }

    }
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

  useEffect(() => {
    focusCurrentLocation();
  }, [mapRegion])

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
          //focusCurrentLocation();
          if(Platform.OS === 'ios') {
            return;
          }
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
