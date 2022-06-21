import React, {
  useState, useEffect, useRef, createContext,
} from 'react';
import shortid from 'shortid';
import { getPosition } from '../../services/geo';
import { getPlaces, getGeocode, getPlaceDetails } from './google-api';
import StorageService from '../../services/storage';
import { createServiceEstimations, getServices } from './api';
import { formatEstimationsResult, formatStopPointsForEstimations, TAG_OPTIONS } from './services';

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
const HISTORY_RECORDS_NUM = 10;

const RidePageContextProvider = ({ navigation, children }) => {
  const [requestStopPoints, setRequestStopPoints] = useState([{
    type: 'pickup',
    location: null,
    useDefaultLocation: true,
    id: shortid.generate(),
  },
  {
    type: 'dropoff',
    location: null,
    useDefaultLocation: false,
    id: shortid.generate(),
  }]);
  const [coords, setCoords] = useState();
  const [currentGeocode, setCurrentGeocode] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedInputIndex, setSelectedInputIndex] = useState(null);
  const [selectedInputTarget, setSelectedInputTarget] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isReadyForSubmit, setIsReadyForSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [historyResults, setHistoryResults] = useState([]);
  const [serviceEstimations, setServiceEstimations] = useState(null);
  const [chosenService, setChosenService] = useState(null);

  const formatEstimations = (services, estimations) => {
    const estimationsMap = {};
    estimations.map((e) => {
      estimationsMap[e.serviceId] = e;
    });
    return services.map((service) => {
      const estimationForService = estimationsMap[service.id];
      const estimationResult = estimationForService && estimationForService.results[0];
      return formatEstimationsResult(service, estimationResult);
    });
  };

  const getServiceEstimations = async () => {
    const formattedStopPoints = formatStopPointsForEstimations(requestStopPoints);
    const [estimations, services] = await Promise.all([
      createServiceEstimations(formattedStopPoints),
      getServices(),
    ]);
    const formattedEstimations = formatEstimations(services, estimations);
    setChosenService(formattedEstimations.find(e => e.eta));
    setServiceEstimations(formattedEstimations);
  };

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
        region: 'il',
        origin: location,
        radius: 20000,
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
    console.log({ placeId });
    try {
      const data = await getPlaceDetails(placeId);
      return data;
    } catch (error) {
      console.log('Got error while try to get places', error);
      return undefined;
    }
  };

  const onAddressSelected = async (selectedItem, loadRide) => {
    const enrichedPlace = await enrichPlaceWithLocation(selectedItem.placeId);
    console.log({ enrichedPlace, selectedInputIndex });
    const reqSps = [...requestStopPoints];
    reqSps[selectedInputIndex] = {
      ...reqSps[selectedInputIndex],
      description: selectedItem.fullText,
      streetAddress: selectedItem.text,
      location: enrichedPlace,
      placeId: selectedItem.placeId,
    };
    console.log({ enrichedPlace, selectedInputIndex });
    setRequestStopPoints(reqSps);
    resetSearchResults();
    saveLastAddresses(selectedItem);

    if (loadRide) {
      validateRequestedStopPoints(reqSps);
    }
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

  const saveLastAddresses = async (item) => {
    const history = await getLastAddresses();
    const filteredHistory = (history || []).filter(h => h.placeId !== item.placeId);
    filteredHistory.unshift(item);
    await StorageService.save({ lastAddresses: filteredHistory.slice(0, HISTORY_RECORDS_NUM) });
  };

  const getLastAddresses = async () => {
    const history = await StorageService.get('lastAddresses') || [];
    return history;
  };

  const loadHistory = async () => {
    const history = await getLastAddresses();
    setHistoryResults(history);
  };

  const validateRequestedStopPoints = async (reqSps) => {
    try {
      const stopPoints = reqSps;
      const isSpsReady = stopPoints.every(r => r.location && r.location.lat && r.location.lng && r.description);
      if (stopPoints.length && isSpsReady) {
        setIsReadyForSubmit(true);
        setIsLoading(true);
        await getServiceEstimations();
        setIsLoading(false);
      } else {
        setIsReadyForSubmit(false);
      }
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };

  const requestRide = async () => {
    console.log({
      serviceId: chosenService.id,
      stopPoints: requestStopPoints.map(sp => ({
        lat: sp.location.lat,
        lng: sp.location.lng,
        description: sp.description,
        type: sp.type,
      })),
    });
  };

  return (
    <RidePageContext.Provider
      value={{
        requestRide,
        loadAddress,
        isLoading,
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
        validateRequestedStopPoints,
        historyResults,
        loadHistory,
        serviceEstimations,
        chosenService,
        setChosenService,
      }}
    >
      {children}
    </RidePageContext.Provider>
  );
};

export default RidePageContextProvider;
