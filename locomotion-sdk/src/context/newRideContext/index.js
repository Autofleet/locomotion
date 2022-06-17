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

import OneSignal from '../../services/one-signal';
import settingsContext from '../settings';
import Mixpanel from '../../services/Mixpanel';
import { getStationsApi, getPlacesByLocation } from '../places/api';
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

import { getPlaces, getGeocode, getPlaceDetails } from './google-api';
import StorageService from '../../services/storage';

const STATION_AUTOREFRESH_INTERVAL = 60000;

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

export const RidePageContext = createContext(null);

const RidePageContextProvider = ({ navigation, children }) => {
  const route = useRoute();
  const useSettings = settingsContext.useContainer();

  const [requestStopPoints, setRequestStopPoints] = useState([{
    type: 'pickup',
    location: null,
    useDefaultLocation: true,
  },
  {
    type: 'dropoff',
    location: null,
    useDefaultLocation: false,
  }]);
  const [coords, setCoords] = useState();
  const [currentGeocode, setCurrentGeocode] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedInputIndex, setSelectedInputIndex] = useState(null);
  const [selectedInputTarget, setSelectedInputTarget] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isReadyForSubmit, setIsReadyForSubmit] = useState(false);
  const [historyResults, setHistoryResults] = useState([]);


  useEffect(() => {
    initLocation();
    initCurrentLocation();
  }, []);

  useEffect(() => {
    initSps();
  }, [currentGeocode]);

  const initLocation = async () => {
    const location = await getCurrentLocation();
    setCoords(location);
  };

  const getCurrentLocationAddress = async () => {
    const currentAddress = await reverseLocationGeocode();
    if (currentAddress) {
      const locationData = {
        description: currentAddress.description,
        location: currentAddress.location,
      };
      return locationData;
    }

    return null;
  };

  const initCurrentLocation = async () => {
    const locationData = await getCurrentLocationAddress();
    setCurrentGeocode(locationData);
  };

  const initSps = async () => {
    const currentAddress = currentGeocode || await getCurrentLocationAddress();
    if (currentGeocode) {
      const sps = [...requestStopPoints].map((s) => {
        if (s.useDefaultLocation) {
          return {
            ...s,
            description: currentAddress.description,
            location: currentAddress.location,
          };
        }

        return s;
      });

      setRequestStopPoints(sps);
    }
  };

  const updateRequestSp = (data) => {
    const reqSps = [...requestStopPoints];
    reqSps[selectedInputIndex] = {
      ...reqSps[selectedInputIndex],
      ...data,
    };

    setRequestStopPoints(reqSps);
  };

  const setSpCurrentLocation = async () => {
    console.log('currentGeocode', currentGeocode);
    if (!currentGeocode) {
      const addressData = await getCurrentLocationAddress();
      updateRequestSp(currentGeocode);
      return true;
    }
    updateRequestSp(currentGeocode);
  };

  const loadAddress = async (input) => {
    const currentCoords = await getCurrentLocation();
    let location = null;
    try {
      location = `${currentCoords.latitude},${currentCoords.longitude}`;
      const data = await getPlaces({
        input,
        location,
      });
      // setSearchResults(data);
      return data;
    } catch (error) {
      console.log('Got error while try to get places', error);
      return undefined;
    }
  };

  const reverseLocationGeocode = async () => {
    try {
      const currentCoords = await getCurrentLocation();
      console.log('currentCoords', currentCoords);

      const location = `${currentCoords.latitude},${currentCoords.longitude}`;
      const data = await getGeocode({
        latlng: location,
      });
      console.log(data);

      const geoLocation = {
        description: data.results[0].formatted_address,
        location: data.results[0].geometry.location,
      };

      return geoLocation;
    } catch (error) {
      console.log('Got error while try to get places', error);
      return undefined;
    }
  };

  const enrichPlaceWithLocation = async (placeId) => {
    try {
      const data = await getPlaceDetails(placeId);
      return data;
    } catch (error) {
      console.log('Got error while try to get places', error);
      return undefined;
    }
  };

  const onAddressSelected = async (selectedItem) => {
    const enrichedPlace = await enrichPlaceWithLocation(selectedItem.placeId);
    const reqSps = [...requestStopPoints];
    reqSps[selectedInputIndex] = {
      ...reqSps[selectedInputIndex],
      description: selectedItem.fullText,
      location: enrichedPlace,
    };

    setRequestStopPoints(reqSps);
    resetSearchResults();
    selectedInputTarget.blur();
  };

  const resetSearchResults = () => setSearchResults(null);

  const getCurrentLocation = async () => {
    const location = await getPosition();
    return location.coords;
  };

  const searchAddress = async (searchText) => {
    if (searchText === null || searchText === '') {
      resetSearchResults();
    } else {
      const results = await loadAddress(searchText);
      const parsed = parseSearchResults(results);
      setSearchResults(parsed);
    }
  };

  const parseSearchResults = results => results.map(r => ({
    text: r.structured_formatting.main_text,
    subText: r.structured_formatting.secondary_text,
    fullText: `${r.structured_formatting.main_text},${r.structured_formatting.secondary_text}`,
    placeId: r.place_id,
  }));

  const getLocalStorageAddreses = async () => {

  };

  const checkFormSps = () => {
    const isSpsReady = requestStopPoints.every(r => r.location && r.location.lat && r.location.lng && r.description);
    if (requestStopPoints.length && isSpsReady) {
      console.log('READY SEND REQUEST');
      setIsReadyForSubmit(true);
    } else {
      console.log('NOT READY');
      setIsReadyForSubmit(false);
    }
  };

  /*   const enrichPlaceWithLocation = async (place) => {
    const data = await getLocation({
      placeId: place.placeid || place.place_id,
    });
    place = { ...place, ...data };
    return place;
  }; */

  /*   const setPlace = async (place) => {
    if (!place.lat && (place.placeid || place.place_id)) {
      place = await enrichPlaceWithLocation(place);
    }
    if (Config.DONT_USE_STATIONS || place.station) {
      if (props.onLocationSelect) {
        props.onLocationSelect({
          ...place,
          type: addressListItems.type,
        });
      }
      setAddressListItems({
        type: addressListItems.type,
        list: [],
      });
    } else {
      setAddressListItems({
        type: addressListItems.type,
        list: [],
      });
      setSearchValue(place.description, props.type, true, place);
    }
  }; */

  // Old


  const [disableAutoLocationFocus, setDisableAutoLocationFocus] = useState(false);
  const [activeRideState, setActiveRide] = useState(null);
  const [activeSpState, setActiveSp] = useState(null);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [displayMatchInfo, setDisplayMatchInfo] = useState(false);
  const [futureRides, setFutureRides] = useState(null);
  const [preRideDetails, setPreRideDetails] = useState({});
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);
  const [, togglePopup] = getTogglePopupsState();
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
      // getStations();
      setActiveSp(null);
      setActiveRide(null);
    }
  };


  /*   if (Config.STATIONS_REFRESH_RATE) {
    useInterval(() => {
      if (!rideOffer && (!requestStopPoints.pickup || !requestStopPoints.dropoff)) {
        getStations();
      }
    }, Config.STATIONS_REFRESH_RATE * 60000);
  } */


  /*   useEffect(() => {
    Mixpanel.pageView(route.name);
    UserService.getUser(navigation);
    getStations();
    loadActiveRide();
    OneSignal.init(notificationsHandler);
    setAutoStationUpdate(setInterval(() => {
      getStations();
    }, STATION_AUTOREFRESH_INTERVAL));

    return () => {
      stopAutoStationUpdate();
    };
  }, []); */


  /*   useEffect(() => {
    if (stations.length) {
      setClosestStations(stations[0]);
      const markersList = stations.map(station => ({
        ...station,
        id: `${station.lat}-${station.lng}`,
      }));

      setMapMarkers(markersList);
    }
  }, [stations]); */

  /*   useEffect(() => {
    let offerTimeout;
    if (rideOffer) {
      setOfferExpired(false);
      setOfferTimer(setTimeout(() => {
        setOfferExpired(true);
      }, useSettings.settingsList.OFFER_EXPIRATION_TIME * 1000));
    } else {
      clearTimeout(offerTimer);
    }
  }, [rideOffer]); */

  const bookValidation = state => state && state.dropoff && state.dropoff.lat
    && state.pickup && state.pickup.lat;

  const loadPreRideDetails = async (origin, destination) => {
    return;
    try {
      const data = await getPreRideDetails({ origin, destination });
      setPreRideDetails(data);
    } catch (error) {
      console.log('Got error while try to get pre detail on a ride', error);
    }
  };

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
    /*     try {
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
    } */
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
        loadAddress,
        reverseLocationGeocode,
        enrichPlaceWithLocation,
        searchTerm,
        setSearchTerm,
        selectedInputIndex,
        setSelectedInputIndex,
        selectedInputTarget,
        setSelectedInputTarget,
        onAddressSelected,
        requestStopPoints,
        searchResults,
        searchAddress,
        updateRequestSp,
        setSpCurrentLocation,
        isReadyForSubmit,
        checkFormSps,
        /*
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
        stopAutoStationUpdate, */
      }}
    >
      {children}
    </RidePageContext.Provider>
  );
};

export default RidePageContextProvider;
