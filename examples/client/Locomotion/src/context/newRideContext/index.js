import React, {
  useState, useEffect, useRef, createContext,
} from 'react';
import { useRoute } from '@react-navigation/native';
import { getPosition } from '../../services/geo';
import settingsContext from '../settings';
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
const HISTORY_RECORDS_NUM = 10;

const RidePageContextProvider = ({ navigation, children }) => {
  const [requestStopPoints, setRequestStopPoints] = useState([{
    type: 'pickup',
    location: null,
    useDefaultLocation: true,
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
    getLastAddresses();
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
      placeId: selectedItem.placeId,
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

  const saveLastAddresses = async (item) => {
    const histroy = await getLastAddresses();
    const filteredHistory = histroy.filter(h => h.placeId !== item.placeId);
    filteredHistory.unshift(item);

    await StorageService.save({ lastAddresses: filteredHistory.slice(0, HISTORY_RECORDS_NUM) });
  };

  const getLastAddresses = async () => {
    const histroy = await StorageService.get('lastAddresses') || [];
    setHistoryResults(histroy);
    return histroy;
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
        historyResults,
      }}
    >
      {children}
    </RidePageContext.Provider>
  );
};

export default RidePageContextProvider;
