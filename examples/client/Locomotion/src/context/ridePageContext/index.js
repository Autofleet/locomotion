import React, {
  useState, useEffect, useRef, createContext,
} from 'react';
import { useRoute } from '@react-navigation/native';
import polyline from '@mapbox/polyline';
import moment from 'moment';
import Config from 'react-native-config';

import { getPosition } from '../../services/geo';
import { getTogglePopupsState } from '../state';
import UserService from '../../services/user';
import settingsContext from '../settings';
import Mixpanel from '../../services/Mixpanel';
import { getStationsApi } from '../places/api';
import {
  cancelFutureRideApi,
  cancelRideApi,
  createOfferApi,
  createRideApi,
  getActiveRides,
  getPreRideDetails,
  getRideSummary,
  sendRating,
} from '../rides/api';
import useInterval from '../../lib/useInterval';

const STATION_AUTOREFRESH_INTERVAL = 60000;

export const RidePageContext = createContext(null);

const RidePageContextProvider = ({ navigation, children }) => {
  const route = useRoute();
  const useSettings = settingsContext.useContainer();

  const [disableAutoLocationFocus, setDisableAutoLocationFocus] = useState(false);
  const [activeRideState, setActiveRide] = useState(null);
  const [activeSpState, setActiveSp] = useState(null);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [displayMatchInfo, setDisplayMatchInfo] = useState(false);
  const [futureRides, setFutureRides] = useState(null);
  const [preRideDetails, setPreRideDetails] = useState({});
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);
  const [, togglePopup] = getTogglePopupsState();
  const [requestStopPoints, setRequestStopPoints] = useState({
    openEdit: false,
    selectedType: 'pickup',
    scheduledTo: null,
  });
  const [rideType, setRideType] = useState('pool');
  const [rideOffer, setRideOffer] = useState(null);
  const [offerExpired, setOfferExpired] = useState(false);
  const [offerTimer, setOfferTimer] = useState(false);
  const [stations, setStations] = useState([]);
  const [rideSummaryData, setRideSummaryData] = useState({});
  const [autoStationUpdate, setAutoStationUpdate] = useState(null);

  const stopAutoStationUpdate = () => clearInterval(autoStationUpdate);
  const notificationsHandler = {
    futureRideCanceled: () => {
      togglePopup('futureRideCanceled', true);
    },
  };
  const loadActiveRide = async () => {
    const response = await getActiveRides({ activeRide: true });

    const { ride: activeRide, futureRides: futureRidesData } = response;
    setFutureRides(futureRidesData);
    if (activeRide) {
      let activeSp = activeRide.stopPoints.find(sp => sp.state === 'pending');
      if (activeSp && activeSp.polyline) {
        activeSp = {
          ...activeSp,
          polyline: polyline.decode(activeSp.polyline)
            .map(tuple => ({ latitude: tuple[0], longitude: tuple[1] })),
        };
        setActiveSp(activeSp);
        if (activeRide && !disableAutoLocationFocus) {
          // focusMarkers();
        }
      }

      setRideOffer(null);
      return setActiveRide(activeRide);
    }
    if (activeRideState) {
      const rideSummary = await getRideSummary({ rideId: activeRideState.externalId });
      if (rideSummary && rideSummary.state === 'completed') {
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
      } else {
        // pickup failed -> show ride canceled
        togglePopup('rideCancel', true);
      }
      getStations();
      setActiveSp(null);
      setActiveRide(null);
    }
  };
  /*
  useInterval(() => {
    loadActiveRide();
  }, 5000); */

  if (Config.STATIONS_REFRESH_RATE) {
    useInterval(() => {
      if (!rideOffer && (!requestStopPoints.pickup || !requestStopPoints.dropoff)) {
        getStations();
      }
    }, Config.STATIONS_REFRESH_RATE * 60000);
  }

  useInterval(() => {
    UserService.getUser(navigation);
  }, 10000);

  useEffect(() => {
    Mixpanel.pageView(route.name);
    UserService.getUser(navigation);
    getStations();
    loadActiveRide();
    setAutoStationUpdate(setInterval(() => {
      getStations();
    }, STATION_AUTOREFRESH_INTERVAL));

    return () => {
      stopAutoStationUpdate();
    };
  }, []);

  useEffect(() => {
    if (!activeRideState) {
      return;
    }
    const origin = activeRideState.stopPoints[0];
    calculatePickupEta(origin);
  }, [activeRideState]);

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

  const bookValidation = state => state && state.dropoff && state.dropoff.lat
    && state.pickup && state.pickup.lat;

  const calculatePickupEta = (origin) => {
    if (origin.completedAt) {
      setDisplayMatchInfo(true);
    } else if (origin && origin.eta) {
      const etaDiff = moment(origin.eta).diff(moment(), 'minutes');
      setDisplayMatchInfo((etaDiff <= useSettings.settingsList.ARRIVE_REMINDER_MIN || (activeRideState && activeRideState.arrivingPush !== null)));
    }
  };

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
      if (coords.latitude && coords.longitude) {
        const { latitude: lat, longitude: lng } = coords;
        const data = await getStationsApi({
          location: { lat, lng },
          stations: true,
        });
        setStations(data);
      }
    } catch (e) {
      console.log('Error getting station position', e);
    }
  };

  const onLocationSelect = (location) => {
    const newState = {
      ...requestStopPoints,
      [location.type]: location,
      openEdit: false,
    };

    setRequestStopPoints(newState);
  };

  const openLocationSelect = (type) => {
    stopAutoStationUpdate();
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

  const createOffer = async () => {
    try {
      const response = await createOfferApi({
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
      console.error('createOffer', e);
    }
  };

  const cancelRide = async () => {
    await cancelRideApi();
    return loadActiveRide();
  };

  const cancelOffer = () => {
    setRideOffer(null);
  };

  const closeAddressViewer = () => {
    setRequestStopPoints({
      ...requestStopPoints,
      openEdit: false,
    });
  };

  const onRating = async (rating) => {
    await sendRating({
      externalId: rideSummaryData.rideId,
      rating,
    });
  };

  const onRideSchedule = (rideTime) => {
    const newState = {
      ...requestStopPoints,
      scheduledTo: rideTime,
    };
    setRequestStopPoints(newState);
  };

  const cancelFutureRide = async (rideId) => {
    const response = await cancelFutureRideApi(rideId);
    loadActiveRide();
  };

  const createFutureOffer = async () => {
    const offerData = {
      numberOfPassengers,
    };
    setRideOffer(offerData);
  };

  const createRide = async () => {
    clearTimeout(offerTimer);

    const response = await createRideApi({
      numberOfPassengers,
      rideType,
      scheduledTo: requestStopPoints.scheduledTo,
      stopPoints: [
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
      ],
    });

    if (response.state === 'rejected') {
      setRideOffer(null);
      togglePopup('rideRejected', true);
    } else {
      setTimeout(() => {
        loadActiveRide();
      }, 2500);
    }
  };

  return (
    <RidePageContext.Provider
      value={{
        disableAutoLocationFocus,
        setDisableAutoLocationFocus,
        activeRideState,
        setActiveRide,
        activeSpState,
        setActiveSp,
        mapMarkers,
        setMapMarkers,
        displayMatchInfo,
        setDisplayMatchInfo,
        futureRides,
        setFutureRides,
        preRideDetails,
        setPreRideDetails,
        numberOfPassengers,
        setNumberOfPassengers,
        togglePopup,
        requestStopPoints,
        setRequestStopPoints,
        rideType,
        setRideType,
        rideOffer,
        setRideOffer,
        offerExpired,
        setOfferExpired,
        offerTimer,
        setOfferTimer,
        stations,
        setStations,
        rideSummaryData,
        setRideSummaryData,
        autoStationUpdate,
        setAutoStationUpdate,
        createOffer,
        cancelOffer,
        cancelRide,
        createRide,
        cancelFutureRide,
        createFutureOffer,
        onRating,
        onRideSchedule,
        onLocationSelect,
        openLocationSelect,
        closeAddressViewer,
        bookValidation,
        stopAutoStationUpdate,
      }}
    >
      {children}
    </RidePageContext.Provider>
  );
};

export default RidePageContextProvider;
