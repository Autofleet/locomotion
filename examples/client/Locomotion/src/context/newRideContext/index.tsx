import React, {
  useState, useEffect, useRef, createContext, useContext,
} from 'react';
import _ from 'lodash';
import { getPosition } from '../../services/geo';
import { getPlaces, getGeocode, getPlaceDetails } from './google-api';
import StorageService from '../../services/storage';
import * as rideApi from './api';
import {
  buildStreetAddress,
  formatEstimationsResult, formatStopPointsForEstimations, getEstimationTags, INITIAL_STOP_POINTS,
} from './utils';
import settings from '../settings';
import SETTINGS_KEYS from '../settings/keys';
import { RideStateContextContext } from '../ridePageStateContext';
import { BS_PAGES } from '../ridePageStateContext/utils';

type Dispatch<A> = (value: A) => void;

interface Ride {
  id?: string;
  notes?: string;
  paymentMethodId?: string;
  serviceTypeId?: string;
}

interface RidePageContextInterface {
  loadAddress: (input: any) => void;
  reverseLocationGeocode: (lat: number, lng: number) => any;
  enrichPlaceWithLocation: (placeId: string) => any;
  searchTerm: string | null;
  setSearchTerm: Dispatch<string | null>;
  selectedInputIndex: number | null;
  setSelectedInputIndex: Dispatch<number | null>;
  selectedInputTarget: any;
  setSelectedInputTarget: Dispatch<any | null>;
  onAddressSelected: (item: any, loadRide: boolean) => void;
  requestStopPoints: any[];
  searchResults: any;
  searchAddress: (searchText: string) => void;
  updateRequestSp: (sp: any) => void;
  setSpCurrentLocation: () => void;
  isReadyForSubmit: boolean;
  historyResults: any[];
  serviceEstimations: any[];
  ride?: Ride;
  updateRide: (ride: any) => void;
  chosenService: any;
  lastSelectedLocation: any;
  getCurrentLocationAddress: () => any;
  saveSelectedLocation: (sp: any) => void;
  requestRide: () => void;
  rideRequestLoading: boolean;
  stopRequestInterval: () => void;
  isLoading: boolean;
  loadHistory: () => void;
  setChosenService: Dispatch<any | null>;
  setServiceEstimations: Dispatch<any | null>;
  initSps: () => void;
  fillLoadSkeleton: () => void;
  serviceRequestFailed: boolean;
  setServiceRequestFailed: Dispatch<boolean>
}

export const RidePageContext = createContext<RidePageContextInterface>({
  loadAddress: (input: any) => undefined,
  reverseLocationGeocode: (lat: number, lng: number) => undefined,
  enrichPlaceWithLocation: (placeId: string) => undefined,
  searchTerm: '',
  setSearchTerm: () => undefined,
  selectedInputIndex: null,
  setSelectedInputIndex: () => undefined,
  selectedInputTarget: null,
  setSelectedInputTarget: () => undefined,
  onAddressSelected: (item: any, loadRide: boolean) => undefined,
  requestStopPoints: [],
  searchResults: [],
  searchAddress: (searchText: string) => undefined,
  updateRequestSp: (sp: any) => undefined,
  setSpCurrentLocation: () => undefined,
  isReadyForSubmit: false,
  historyResults: [],
  serviceEstimations: [],
  updateRide: (ride: any) => undefined,
  chosenService: null,
  lastSelectedLocation: null,
  getCurrentLocationAddress: () => undefined,
  saveSelectedLocation: (sp: any) => undefined,
  rideRequestLoading: false,
  stopRequestInterval: () => undefined,
  isLoading: false,
  loadHistory: () => undefined,
  setChosenService: () => undefined,
  setServiceEstimations: () => undefined,
  initSps: () => undefined,
  fillLoadSkeleton: () => undefined,
  requestRide: () => undefined,
  serviceRequestFailed: false,
  setServiceRequestFailed: () => undefined,
});

const HISTORY_RECORDS_NUM = 10;
let SERVICE_ESTIMATIONS_INTERVAL_IN_SECONDS: number;

const RidePageContextProvider = ({ children }: {
  children: any
}) => {
  const { checkStopPointsInTerritory, changeBsPage } = useContext(RideStateContextContext);
  const [requestStopPoints, setRequestStopPoints] = useState(INITIAL_STOP_POINTS);
  const [currentGeocode, setCurrentGeocode] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [selectedInputIndex, setSelectedInputIndex] = useState<number | null>(null);
  const [selectedInputTarget, setSelectedInputTarget] = useState<any | null>(null);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isReadyForSubmit, setIsReadyForSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [historyResults, setHistoryResults] = useState([]);
  const [serviceEstimations, setServiceEstimations] = useState<any | null>(null);
  const [ride, setRide] = useState<Ride>({});
  const [chosenService, setChosenService] = useState<any | null>(null);
  const [lastSelectedLocation, saveSelectedLocation] = useState(false);
  const [rideRequestLoading, setRideRequestLoading] = useState(false);
  const [serviceRequestFailed, setServiceRequestFailed] = useState<boolean>(false);
  const intervalRef = useRef<any>();

  const { getSettingByKey } = settings.useContainer();

  const stopRequestInterval = () => {
    clearInterval(intervalRef.current);
  };
  const formatEstimations = (services: any[], estimations: any, tags: any): any => {
    const estimationsMap: any = {};
    estimations.map((e: any) => {
      estimationsMap[e.serviceId] = e;
    });
    const formattedServices = services.map((service) => {
      const estimationForService = estimationsMap[service.id];
      const estimationResult = estimationForService && estimationForService.results.length && estimationForService.results[0];
      return formatEstimationsResult(service, estimationResult, tags);
    });
    return formattedServices.sort((a, b) => a.priority - b.priority);
  };

  const getServiceEstimations = async () => {
    setIsReadyForSubmit(false);
    const formattedStopPoints = formatStopPointsForEstimations(requestStopPoints);
    const [estimations, services] = await Promise.all([
      rideApi.createServiceEstimations(formattedStopPoints),
      rideApi.getServices(),
    ]);
    const tags = getEstimationTags(estimations);
    const formattedEstimations = formatEstimations(services, estimations, tags);
    setChosenService(formattedEstimations.find((e: any) => e.eta));
    setServiceEstimations(formattedEstimations);
  };

  const validateRequestedStopPoints = async (reqSps: any[]) => {
    const stopPoints = reqSps;
    const isSpsReady = stopPoints.every(r => r.lat && r.lng && r.description);
    const areStopPointsInTerritory = await checkStopPointsInTerritory(stopPoints);
    if (stopPoints.length && isSpsReady && areStopPointsInTerritory) {
      setIsReadyForSubmit(true);
    } else {
      setIsReadyForSubmit(false);
    }
  };

  const getServiceEstimationsFetchingInterval = async () => {
    SERVICE_ESTIMATIONS_INTERVAL_IN_SECONDS = await getSettingByKey(
      SETTINGS_KEYS.SERVICE_ESTIMATIONS_INTERVAL_IN_SECONDS,
    );
  };

  useEffect(() => {
    initCurrentLocation();
    getServiceEstimationsFetchingInterval();
  }, []);

  useEffect(() => {
    initSps();
  }, [currentGeocode]);

  useEffect(() => {
    validateRequestedStopPoints(requestStopPoints);
  }, [requestStopPoints]);

  const reverseLocationGeocode = async (pinLat: number | null = null, pinLng: number | null = null): Promise<any | undefined> => {
    try {
      let location;
      if (pinLat && pinLng) {
        location = `${pinLat},${pinLng}`;
      } else {
        const currentCoords = await getCurrentLocation();
        location = `${currentCoords.latitude},${currentCoords.longitude}`;
      }

      const data = await getGeocode({
        latlng: location,
      });

      const { lat, lng } = data.results[0].geometry.location;
      const geoLocation = {
        streetAddress: buildStreetAddress(data),
        description: data.results[0].formatted_address,
        lat,
        lng,
      };

      return geoLocation;
    } catch (error) {
      console.log('Got error while try to get places', error);
      return undefined;
    }
  };

  const getCurrentLocationAddress = async (): Promise<any | null> => {
    const currentAddress = await reverseLocationGeocode();
    if (currentAddress) {
      const locationData = {
        streetAddress: currentAddress.streetAddress,
        description: currentAddress.description,
        lat: currentAddress.lat,
        lng: currentAddress.lng,
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
      const sps = [...INITIAL_STOP_POINTS].map((s) => {
        if (s.useDefaultLocation) {
          return {
            ...s,
            streetAddress: currentAddress.streetAddress,
            description: currentAddress.description,
            lat: currentAddress.lat,
            lng: currentAddress.lng,
          };
        }

        return s;
      });

      setRequestStopPoints(sps);
    }
  };

  const updateRequestSp = (data: any[]) => {
    const reqSps = [...requestStopPoints];
    const index = _.isNil(selectedInputIndex) ? requestStopPoints.length - 1 : selectedInputIndex;
    reqSps[index || 0] = {
      ...reqSps[index || 0],
      ...data,
    };

    setRequestStopPoints(reqSps);
  };

  const setSpCurrentLocation = async () => {
    if (!currentGeocode) {
      await getCurrentLocationAddress();
      updateRequestSp(currentGeocode);
      return true;
    }
    updateRequestSp(currentGeocode);
  };

  const loadAddress = async (input: any) => {
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

  const enrichPlaceWithLocation = async (placeId: string) => {
    console.log({ placeId });
    try {
      const data = await getPlaceDetails(placeId);
      return data;
    } catch (error) {
      console.log('Got error while try to get places', error);
      return undefined;
    }
  };

  const onAddressSelected = async (selectedItem: any, loadRide: boolean) => {
    if (selectedItem.isLoading) {
      return null;
    }
    const enrichedPlace = await enrichPlaceWithLocation(selectedItem.placeId);
    const reqSps = [...requestStopPoints];
    reqSps[selectedInputIndex || 0] = {
      ...reqSps[selectedInputIndex || 0],
      description: selectedItem.fullText,
      streetAddress: selectedItem.text,
      placeId: selectedItem.placeId,
      lat: enrichedPlace.lat,
      lng: enrichedPlace.lng,
    };
    console.log({ enrichedPlace, selectedInputIndex });
    resetSearchResults();
    saveLastAddresses(selectedItem);

    if (loadRide) {
      validateRequestedStopPoints(reqSps);
    }
    setRequestStopPoints(reqSps);
  };

  const resetSearchResults = () => setSearchResults(null);

  const getCurrentLocation = async () => {
    const location = await getPosition();
    return location.coords;
  };

  const searchAddress = async (searchText: string) => {
    if (searchText === null || searchText === '') {
      resetSearchResults();
    } else {
      const results = await loadAddress(searchText);
      const parsed = parseSearchResults(results);
      setSearchResults(parsed);
    }
  };

  const parseSearchResults = (results: any[]) => results.map(r => ({
    text: r.structured_formatting.main_text,
    subText: r.structured_formatting.secondary_text,
    fullText: `${r.structured_formatting.main_text}, ${r.structured_formatting.secondary_text}`,
    placeId: r.place_id,
  }));

  const saveLastAddresses = async (item: any) => {
    const history: any[] = await getLastAddresses();
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

  const tryServiceEstimations = async () => {
    try {
      setIsLoading(true);
      await getServiceEstimations();
      intervalRef.current = setInterval(async () => {
        await getServiceEstimations();
      }, (SERVICE_ESTIMATIONS_INTERVAL_IN_SECONDS * 1000));
    } catch (e) {
      setServiceRequestFailed(true);
      setIsLoading(false);
      setIsReadyForSubmit(false);
      console.error(e);
    }
  };

  useEffect(() => {
    if (serviceEstimations) {
      setIsLoading(false);
    }
  }, [serviceEstimations]);

  useEffect(() => {
    if (isReadyForSubmit) {
      tryServiceEstimations();
    }
  }, [isReadyForSubmit]);

  const requestRide = async (): Promise<void> => {
    setRideRequestLoading(true);

    changeBsPage(BS_PAGES.CONFIRMING_RIDE);
    const formattedRide = {
      serviceId: chosenService?.id,
      paymentMethodId: ride.paymentMethodId,
      rideType: 'passenger',
      stopPoints: requestStopPoints.map((sp, i) => ({
        lat: Number(sp.lat),
        lng: Number(sp.lng),
        description: sp.description || sp.streetAddress,
        type: sp.type,
        ...(i === 0 && { notes: ride.notes }),
      })),
    };
    try {
      const afRide = await rideApi.createRide(formattedRide);
      setRide(afRide);
      changeBsPage(BS_PAGES.ACTIVE_RIDE);
    } catch (e) {
      // TODO: error handling
      changeBsPage(BS_PAGES.NO_AVAILABLE_VEHICLES);
    } finally {
      setRideRequestLoading(false);
    }
  };


  const fillLoadSkeleton = () => {
    const filledArray = new Array(4).fill({ isLoading: true });
    if (!searchResults || !searchResults.length || (searchResults.length && !searchResults[0].isLoading)) {
      setSearchResults(filledArray);
    }
  };

  const updateRide = (newRide: Ride) => {
    setRide({
      ...ride,
      ...newRide,
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
        historyResults,
        loadHistory,
        serviceEstimations,
        ride,
        updateRide,
        chosenService,
        setChosenService,
        setServiceEstimations,
        initSps,
        lastSelectedLocation,
        saveSelectedLocation,
        getCurrentLocationAddress,
        fillLoadSkeleton,
        rideRequestLoading,
        stopRequestInterval,
        serviceRequestFailed,
        setServiceRequestFailed,
      }}
    >
      {children}
    </RidePageContext.Provider>
  );
};

export default RidePageContextProvider;