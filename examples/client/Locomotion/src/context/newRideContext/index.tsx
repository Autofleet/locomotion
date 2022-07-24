import React, {
  useState, useEffect, useRef, createContext, useContext,
} from 'react';
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import moment from 'moment';
import i18n from '../../I18n';
import { FutureRidesContext } from '../futureRides';
import { UserContext } from '../user';
import { getPosition, DEFAULT_COORDS } from '../../services/geo';
import { getPlaces, getGeocode, getPlaceDetails } from './google-api';
import StorageService from '../../services/storage';
import Mixpanel from '../../services/Mixpanel';
import * as rideApi from './api';
import {
  buildStreetAddress,
  formatEstimationsResult,
  formatStopPointsForEstimations,
  getEstimationTags,
  INITIAL_STOP_POINTS,
  RIDE_POPUPS, RidePopupNames, RIDE_FAILED_REASONS,
} from './utils';
import settings from '../settings';
import SETTINGS_KEYS from '../settings/keys';
import { RideStateContextContext } from '../ridePageStateContext';
import { BS_PAGES } from '../ridePageStateContext/utils';
import { RIDE_STATES, RIDE_FINAL_STATES, STOP_POINT_TYPES } from '../../lib/commonTypes';
import useBackgroundInterval from '../../lib/useBackgroundInterval';
import { formatSps } from '../../lib/ride/utils';
import { APP_ROUTES, MAIN_ROUTES } from '../../pages/routes';
import * as navigationService from '../../services/navigation';
import { BottomSheetContext } from '../bottomSheetContext';

type Dispatch<A> = (value: A) => void;
type Nav = {
  navigate: (value: string, object?: any) => void;
}

export interface RideInterface {
  priceCurrency?: any;
  priceAmount?: any;
  id?: string;
  notes?: string;
  paymentMethodId?: string;
  serviceId?: string;
  scheduledTo?: string;
  driver?: any;
  stopPoints?: any[];
  vehicle?: any;
  rating?: number;
  state?: string;
  trackerUrl?: string;
  serviceType?: any;
  payment?: any;
  canceledBy?: string;
  cancelable?: boolean;
  createdAt?: string;
  priceCalculationId?: string;
}

interface RidePageContextInterface {
  loadAddress: (input: any) => void;
  reverseLocationGeocode: (lat: number, lng: number) => Promise<any>;
  enrichPlaceWithLocation: (placeId: string) => any;
  searchTerm: string | null;
  setSearchTerm: Dispatch<string | null>;
  selectedInputIndex: number | null;
  setSelectedInputIndex: Dispatch<number | null>;
  selectedInputTarget: any;
  setSelectedInputTarget: Dispatch<any | null>;
  onAddressSelected: (item: any, loadRide: boolean, index?: number) => void;
  requestStopPoints: any[];
  searchResults: any;
  searchAddress: (searchText: string) => void;
  updateRequestSp: (sp: any) => void;
  setSpCurrentLocation: () => void;
  historyResults: any[];
  serviceEstimations: any[];
  ride: RideInterface;
  updateRidePayload: (ride: any) => void;
  chosenService: any;
  lastSelectedLocation: any;
  getCurrentLocationAddress: () => any;
  saveSelectedLocation: (sp: any) => void;
  requestRide: (pickup?: any) => void;
  rideRequestLoading: boolean;
  stopRequestInterval: () => void;
  loadHistory: () => void;
  setChosenService: Dispatch<any | null>;
  setServiceEstimations: Dispatch<any | null>;
  initSps: () => void;
  fillLoadSkeleton: () => void;
  ridePopup: string | null;
  setRidePopup: Dispatch<RidePopupNames | null>;
  trackRide: () => Promise<string>;
  postRideSubmit: (rideId: string, ridePayload: any) => any;
  cancelRide: (rideId?: string) => Promise<void>;
  getCallNumbers: () => Promise<void>;
  getRideFromApi: (rideId: string) => Promise<RideInterface>;
  setRide: Dispatch<RideInterface>;
  updateRide: (rideId: string | undefined, ride: RideInterface) => Promise<void>;
  validateRequestedStopPoints: (reqSps: any[]) => void;
  setRequestStopPoints: (sps: any) => void;
  tryServiceEstimations: () => Promise<void>;
  getService: (serviceId: string) => Promise<any>;
  getServices: () => Promise<any[]>;
  cleanRideState: () => void;
  setUnconfirmedPickupTime: Dispatch<number | null>;
  unconfirmedPickupTime: number | null;
}

export const RidePageContext = createContext<RidePageContextInterface>({
  loadAddress: (input: any) => undefined,
  reverseLocationGeocode: async (lat: number, lng: number) => undefined,
  enrichPlaceWithLocation: (placeId: string) => undefined,
  searchTerm: '',
  setSearchTerm: () => undefined,
  selectedInputIndex: null,
  setSelectedInputIndex: () => undefined,
  selectedInputTarget: null,
  setSelectedInputTarget: () => undefined,
  onAddressSelected: (item: any, loadRide: boolean, index?: number) => undefined,
  requestStopPoints: [],
  searchResults: [],
  searchAddress: (searchText: string) => undefined,
  updateRequestSp: (sp: any) => undefined,
  setSpCurrentLocation: () => undefined,
  historyResults: [],
  serviceEstimations: [],
  updateRidePayload: (ride: any) => undefined,
  chosenService: null,
  lastSelectedLocation: null,
  getCurrentLocationAddress: () => undefined,
  saveSelectedLocation: (sp: any) => undefined,
  rideRequestLoading: false,
  stopRequestInterval: () => undefined,
  loadHistory: () => undefined,
  setChosenService: () => undefined,
  setServiceEstimations: () => undefined,
  initSps: () => undefined,
  fillLoadSkeleton: () => undefined,
  requestRide: (pickup?: any) => undefined,
  ridePopup: null,
  setRidePopup: () => undefined,
  ride: {},
  trackRide: async () => '',
  postRideSubmit: (rideId: string, ridePayload: any) => undefined,
  cancelRide: async () => undefined,
  getCallNumbers: async () => undefined,
  getRideFromApi: async () => ({}),
  setRide: () => undefined,
  updateRide: async (rideId: string | undefined, ride: RideInterface) => undefined,
  validateRequestedStopPoints: (reqSps: any[]) => undefined,
  setRequestStopPoints: (sps: any) => undefined,
  tryServiceEstimations: async () => undefined,
  getService: async (serviceId: string) => ({}),
  getServices: async () => [],
  cleanRideState: () => undefined,
  setUnconfirmedPickupTime: () => undefined,
  unconfirmedPickupTime: null,
});

const HISTORY_RECORDS_NUM = 10;

const RidePageContextProvider = ({ children }: {
  children: any
}) => {
  const { locationGranted, user } = useContext(UserContext);
  const navigation = useNavigation<Nav>();
  const { setGenericErrorDetails } = useContext(BottomSheetContext);
  const { checkStopPointsInTerritory, changeBsPage, currentBsPage } = useContext(RideStateContextContext);
  const { setNewFutureRide, loadFutureRides } = useContext(FutureRidesContext);
  const [requestStopPoints, setRequestStopPoints] = useState(INITIAL_STOP_POINTS);
  const [currentGeocode, setCurrentGeocode] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [selectedInputIndex, setSelectedInputIndex] = useState<number | null>(null);
  const [selectedInputTarget, setSelectedInputTarget] = useState<any | null>(null);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [historyResults, setHistoryResults] = useState([]);
  const [serviceEstimations, setServiceEstimations] = useState<any | null>(null);
  const [ride, setRide] = useState<RideInterface>({});
  const [chosenService, setChosenService] = useState<any | null>(null);
  const [lastSelectedLocation, saveSelectedLocation] = useState(false);
  const [rideRequestLoading, setRideRequestLoading] = useState(false);
  const [ridePopup, setRidePopup] = useState<RidePopupNames | null>(null);
  const [unconfirmedPickupTime, setUnconfirmedPickupTime] = useState<number | null>(null);
  const intervalRef = useRef<any>();

  const stopRequestInterval = () => {
    clearInterval(intervalRef.current);
  };

  const cleanRequestStopPoints = () => {
    setRequestStopPoints([]);
    setChosenService(null);
  };

  const cleanRideState = () => {
    initSps();
    setRide({});
  };

  const RIDE_STATES_TO_SCREENS = {
    [RIDE_STATES.PENDING]: () => {
      changeBsPage(BS_PAGES.CONFIRMING_RIDE);
    },
    [RIDE_STATES.MATCHING]: (matchingRide: RideInterface) => {
      setRide(matchingRide);
      changeBsPage(BS_PAGES.CONFIRMING_RIDE);
    },
    [RIDE_STATES.REJECTED]: () => { changeBsPage(BS_PAGES.NO_AVAILABLE_VEHICLES); },
    [RIDE_STATES.COMPLETED]: (completedRide: any) => {
      navigation.navigate(MAIN_ROUTES.POST_RIDE, { rideId: completedRide.id });
      changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
      cleanRideState();
    },
    [RIDE_STATES.DISPATCHED]: (newRide: any) => {
      cleanRequestStopPoints();
      setRide(newRide);
      changeBsPage(BS_PAGES.ACTIVE_RIDE);
    },
    [RIDE_STATES.ACTIVE]: (activeRide: any) => {
      cleanRequestStopPoints();
      setRide(activeRide);
      changeBsPage(BS_PAGES.ACTIVE_RIDE);
    },
    [RIDE_STATES.CANCELED]: (canceledRide: any) => {
      if (canceledRide.canceledBy !== user?.id) {
        setRidePopup(RIDE_POPUPS.RIDE_CANCELED_BY_DISPATCHER);
      } else {
        cleanRideState();
        changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
      }
    },
    [RIDE_STATES.FAILED]: () => {
      setRidePopup(RIDE_POPUPS.RIDE_CANCELED_BY_DISPATCHER);
      cleanRideState();
    },
  };

  const formatRide = async (rideToFormat: RideInterface) => {
    const serviceType = rideToFormat.serviceId ? ride.serviceType
      || await rideApi.getService(rideToFormat.serviceId) : null;
    return {
      ...rideToFormat,
      stopPoints: formatSps(rideToFormat.stopPoints),
      serviceType,
    };
  };

  const { getSettingByKey } = settings.useContainer();


  const formatEstimations = (services: any[], estimations: any, tags: any): any => {
    const estimationsMap: any = {};
    estimations.map((e: any) => {
      estimationsMap[e.serviceId] = e;
    });
    const formattedServices = services.map((service) => {
      const estimationForService = estimationsMap[service.id];
      const estimationResult = estimationForService?.results?.length
        && estimationForService.results[0];
      return formatEstimationsResult(service, estimationResult, tags);
    });

    return formattedServices.sort((a, b) => {
      if (
        (a.serviceAvailabilitiesNumber !== 0 && b.serviceAvailabilitiesNumber !== 0)
        || (a.serviceAvailabilitiesNumber === 0 && b.serviceAvailabilitiesNumber === 0)
      ) {
        return a.priority - b.priority;
      }

      return a.serviceAvailabilitiesNumber === 0 ? -1 : 1;
    });
  };

  const getServiceEstimations = async (throwError = true) => {
    changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
    try {
      const formattedStopPoints = formatStopPointsForEstimations(requestStopPoints);
      const { estimations, services } = await rideApi.createServiceEstimations(formattedStopPoints, ride.scheduledTo);
      const tags = getEstimationTags(estimations);
      const formattedEstimations = formatEstimations(services, estimations, tags);
      setChosenService(formattedEstimations.find((e: any) => e.eta));
      setServiceEstimations(formattedEstimations);
    } catch (e) {
      if (throwError) {
        setRidePopup(RIDE_POPUPS.FAILED_SERVICE_REQUEST);
      }
    }
  };

  const getService = async (serviceId: string) => rideApi.getService(serviceId);

  const getServices = async () => rideApi.getServices();

  const getServiceEstimationsFetchingInterval = () => getSettingByKey(
    SETTINGS_KEYS.SERVICE_ESTIMATIONS_INTERVAL_IN_SECONDS,
  );

  const tryServiceEstimations = async () => {
    const serviceEstimationsInterval = await getServiceEstimationsFetchingInterval();
    await getServiceEstimations();
    intervalRef.current = setInterval(async () => {
      if (intervalRef.current) {
        await getServiceEstimations(false);
      }
    }, ((serviceEstimationsInterval || 60) * 1000));
  };

  const validateStopPointInTerritory = (stopPoints: any[]) => checkStopPointsInTerritory(stopPoints);

  const validateRequestedStopPoints = (reqSps: any[]) => {
    const stopPoints = reqSps;
    const isSpsReady = stopPoints.every(r => r.lat && r.lng && r.description);
    if (stopPoints.length && isSpsReady) {
      const areStopPointsInTerritory = validateStopPointInTerritory(stopPoints);
      if (areStopPointsInTerritory) {
        tryServiceEstimations();
      }
    }
  };


  const loadActiveRide = async () => {
    const activeRide = await rideApi.getActiveRide();
    if (activeRide) {
      const formattedRide = await formatRide(activeRide);
      const screenFunction = RIDE_STATES_TO_SCREENS[formattedRide?.state || ''];
      if (screenFunction) {
        screenFunction(formattedRide);
      }
    } else {
      cleanRideState();
      changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadActiveRide();
    }
  }, []);

  useBackgroundInterval(async () => {
    if (user?.id && !rideRequestLoading) {
      if (ride?.id) {
        try {
          const rideLoaded = await rideApi.getRide(ride?.id);
          const formattedRide = await formatRide(rideLoaded);
          if (ride.state !== rideLoaded.state) {
            const screenFunction = RIDE_STATES_TO_SCREENS[rideLoaded.state];
            if (screenFunction) {
              screenFunction(rideLoaded);
            }
          }
          if (!RIDE_FINAL_STATES.includes(rideLoaded?.state || '')) {
            setRide(formattedRide);
          }
        } catch (e) {
          cleanRideState();
          changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
        }
      } else {
        loadActiveRide();
      }
    }
  }, 4000);

  useEffect(() => {
    validateRequestedStopPoints(requestStopPoints);
  }, [requestStopPoints]);

  const getRideFromApi = async (rideId: string): Promise<RideInterface> => formatRide(await rideApi.getRide(rideId));

  useEffect(() => {
    if (unconfirmedPickupTime) {
      validateRequestedStopPoints(requestStopPoints);
      setUnconfirmedPickupTime(null);
    }
  }, [ride.scheduledTo]);
  const reverseLocationGeocode = async (pinLat: number | null = null, pinLng: number | null = null)
    : Promise<any | undefined> => {
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
        streetAddress: buildStreetAddress(data) || data.results[0].formatted_address,
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
    if (locationGranted) {
      const locationData = await getCurrentLocationAddress();
      setCurrentGeocode(locationData);
    }
  };

  useEffect(() => {
    initCurrentLocation();
  }, [locationGranted]);

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

  useEffect(() => {
    if (requestStopPoints.filter((sp => sp.lat)).length <= 1) {
      initSps();
    }
  }, [currentGeocode]);

  const updateRequestSp = (data: any[], index?: number) => {
    const reqSps = [...requestStopPoints];
    if (_.isNil(index)) {
      index = (_.isNil(selectedInputIndex) ? requestStopPoints.length - 1 : selectedInputIndex);
    }
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
    let currentCoords;
    if (locationGranted) {
      currentCoords = await getCurrentLocation();
    }
    try {
      const location = currentCoords ? `${currentCoords.latitude},${currentCoords.longitude}` : null;
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

  const onAddressSelected = async (selectedItem: any, loadRide: boolean, index?: number) => {
    if (selectedItem.isLoading) {
      return null;
    }
    const enrichedPlace = await enrichPlaceWithLocation(selectedItem.placeId);
    const reqSps = [...requestStopPoints];
    reqSps[index || selectedInputIndex || 0] = {
      ...reqSps[index || selectedInputIndex || 0],
      description: selectedItem.fullText,
      streetAddress: selectedItem.text,
      placeId: selectedItem.placeId,
      lat: enrichedPlace.lat,
      lng: enrichedPlace.lng,
    };
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
    if (!location) {
      changeBsPage(BS_PAGES.LOCATION_REQUEST);
      return DEFAULT_COORDS.coords;
    }
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

  const parseSearchResults = (results: any[]) => results.map((r) => {
    let formatedAddress = r.structured_formatting.main_text;
    if (r.structured_formatting.secondary_text) {
      formatedAddress = `${formatedAddress}, ${r.structured_formatting.secondary_text}`;
    }

    return {
      text: r.structured_formatting.main_text,
      subText: r.structured_formatting.secondary_text,
      fullText: formatedAddress,
      placeId: r.place_id,
    };
  });

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

  const FAILED_TO_CREATE_RIDE_ACTIONS = {
    [RIDE_FAILED_REASONS.BUSY]: () => { changeBsPage(BS_PAGES.NO_AVAILABLE_VEHICLES); },
    [RIDE_FAILED_REASONS.USER_FUTURE_RIDE_INTERVAL_LIMIT_REACHED]: () => {
      const bsContent = ride.scheduledTo ? 'futureRideLimit' : 'futureRideLimitOnAsap';
      setGenericErrorDetails({
        titleText: i18n.t(`bottomSheetContent.${bsContent}.titleText`),
        buttonText: i18n.t(`bottomSheetContent.${bsContent}.buttonText`),
        subTitleText: i18n.t(`bottomSheetContent.${bsContent}.subTitleText`),
        buttonPress: () => {
          tryServiceEstimations();
          changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
        },
      });
      changeBsPage(BS_PAGES.GENERIC_ERROR);
    },
    // mocks for now
    [RIDE_FAILED_REASONS.USER_HAS_OUTSTANDING_BALANCE]: () => {
      setGenericErrorDetails({
        titleText: i18n.t('bottomSheetContent.outstandingBalance.titleText'),
        buttonText: i18n.t('bottomSheetContent.outstandingBalance.buttonText'),
        subTitleText: i18n.t('bottomSheetContent.outstandingBalance.subTitleText'),
        buttonPress: () => {
          changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
        },
      });
      changeBsPage(BS_PAGES.GENERIC_ERROR);
    },
    [RIDE_FAILED_REASONS.CASH_NOT_ALLOWED]: () => {
      setGenericErrorDetails({
        titleText: i18n.t('bottomSheetContent.outstandingBalance.titleText'),
        buttonText: i18n.t('bottomSheetContent.outstandingBalance.buttonText'),
        subTitleText: i18n.t('bottomSheetContent.outstandingBalance.subTitleText'),
        buttonPress: () => {
          changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
        },
      });
      changeBsPage(BS_PAGES.GENERIC_ERROR);
    },
    [RIDE_FAILED_REASONS.PAYMENT_METHOD_EXPIRED]: () => {
      setGenericErrorDetails({
        titleText: i18n.t('bottomSheetContent.outstandingBalance.titleText'),
        buttonText: i18n.t('bottomSheetContent.outstandingBalance.buttonText'),
        subTitleText: i18n.t('bottomSheetContent.outstandingBalance.subTitleText'),
        buttonPress: () => {
          changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
        },
      });
      changeBsPage(BS_PAGES.GENERIC_ERROR);
    },
    [RIDE_FAILED_REASONS.COULD_NOT_CREATE_PAYMENT_INTENT]: () => {
      setGenericErrorDetails({
        titleText: i18n.t('bottomSheetContent.outstandingBalance.titleText'),
        buttonText: i18n.t('bottomSheetContent.outstandingBalance.buttonText'),
        subTitleText: i18n.t('bottomSheetContent.outstandingBalance.subTitleText'),
        buttonPress: () => {
          changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
        },
      });
      changeBsPage(BS_PAGES.GENERIC_ERROR);
    },
  };

  const requestRide = async (pickupLocation?: any): Promise<void> => {
    let stopPoints = requestStopPoints;
    if (pickupLocation) {
      if (!validateStopPointInTerritory([pickupLocation])) {
        return;
      }

      stopPoints = [{ ...pickupLocation, type: STOP_POINT_TYPES.STOP_POINT_PICKUP }, ...stopPoints.slice(1)];
    }
    setRideRequestLoading(true);
    stopRequestInterval();
    setServiceEstimations(null);
    changeBsPage(BS_PAGES.CONFIRMING_RIDE);
    const rideToCreate = {
      serviceId: chosenService?.id,
      paymentMethodId: ride.paymentMethodId,
      rideType: 'passenger',
      ...(ride.scheduledTo && { scheduledTo: ride.scheduledTo }),
      stopPoints: stopPoints.map((sp, i) => ({
        lat: Number(sp.lat),
        lng: Number(sp.lng),
        description: sp.streetAddress || sp.description,
        type: sp.type,
        ...(i === 0 && { notes: ride.notes }),
      })),
    };
    try {
      const afRide = await rideApi.createRide(rideToCreate);
      if (afRide.state === RIDE_STATES.REJECTED) {
        throw new Error(RIDE_FAILED_REASONS.BUSY);
      }
      if (afRide.scheduledTo) {
        loadFutureRides();
        setNewFutureRide(afRide);
        changeBsPage(BS_PAGES.CONFIRM_FUTURE_RIDE);
      } else {
        const formattedRide = await formatRide(afRide);
        setRide(formattedRide);
      }
    } catch (e: any) {
      const key = e.response?.data?.errors[0] || e.message;
      if (FAILED_TO_CREATE_RIDE_ACTIONS[key]) {
        FAILED_TO_CREATE_RIDE_ACTIONS[key]();
      } else {
        FAILED_TO_CREATE_RIDE_ACTIONS[RIDE_FAILED_REASONS.BUSY]();
      }
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

  const updateRidePayload = (newRide: RideInterface) => {
    setRide({
      ...ride,
      ...newRide,
    });
  };

  const patchRideRating = async (rideId: string, rating: number|null): Promise<any> => {
    if (!rating) {
      return null;
    }

    try {
      const updatedRide = await rideApi.patchRide(rideId, { rating });
      updateRidePayload(updatedRide);
      if (updatedRide) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const chargeTip = async (priceCalculationId: string, tip:number|null): Promise<any> => {
    // TODO: implement
    if (!tip) {
      return null;
    }

    try {
      const tipChargeResponse = await rideApi.additionalCharge(priceCalculationId, tip, 'tip');
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const postRideSubmit = async (rideId: string, ridePayload: any): Promise<boolean> => {
    const { priceCalculationId, rating, tip } = ridePayload;
    console.log('Post Ride Data', {
      rideId, priceCalculationId, rating, tip,
    });
    await Promise.all([
      tip ? chargeTip(priceCalculationId, tip) : () => null,
      rating ? patchRideRating(rideId, rating) : () => null,
    ]);
    return true;
  };

  const updateRide = async (rideId: string | undefined, newRide: RideInterface) => {
    await rideApi.patchRide(rideId, newRide);
  };

  const trackRide = async () => {
    if (!ride.trackerUrl) {
      const trackData = await rideApi.track(ride.id);
      const trackerUrl = `${Config.TRACKER_URL}/${trackData.id}`;
      setRide({
        ...ride,
        trackerUrl,
      });
      return trackerUrl;
    }

    return ride.trackerUrl;
  };


  const cancelRide = async (rideId?: string) => {
    await rideApi.cancelRide(rideId || ride?.id);
  };

  const getCallNumbers = async () => {
    const rideId = ride?.id;
    const stopPoint = ride?.stopPoints && ride.stopPoints[0];
    if (stopPoint) {
      const { id: spId } = stopPoint || {};
      let number;
      const stopPointFromServer = await rideApi.getStopPoint(rideId, spId);
      number = stopPointFromServer.maskedDriverPhoneNumber;
      if (!number) {
        Mixpanel.setEvent('getting masked-phones', {
          ride: rideId,
          id: spId,
        });
        const maskSpRes = await rideApi.maskStopPointPhones(rideId, spId);
        if (maskSpRes && maskSpRes.sp) {
          number = maskSpRes.sp.maskedDriverPhoneNumber;
          Mixpanel.setEvent(`got masked-phones: ${number}`);
        } else {
          number = stopPoint.metadata.contactPersonPhone;
        }
      }
      Mixpanel.setEvent('tel', { number });
      return number;
    }
    return null;
  };

  return (
    <RidePageContext.Provider
      value={{
        requestRide,
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
        historyResults,
        loadHistory,
        serviceEstimations,
        ride,
        setRide,
        updateRide,
        updateRidePayload,
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
        ridePopup,
        setRidePopup,
        trackRide,
        postRideSubmit,
        getRideFromApi,
        cancelRide,
        getCallNumbers,
        validateRequestedStopPoints,
        setRequestStopPoints,
        tryServiceEstimations,
        getService,
        getServices,
        cleanRideState,
        setUnconfirmedPickupTime,
        unconfirmedPickupTime,
      }}
    >
      {children}
    </RidePageContext.Provider>
  );
};

export default RidePageContextProvider;
