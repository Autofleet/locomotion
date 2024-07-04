/* eslint-disable max-len */
import React, {
  useState, useEffect, useRef, createContext, useContext, useCallback,
} from 'react';
import { AppState } from 'react-native';
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import _, { pick } from 'lodash';
import moment, { Moment } from 'moment-timezone';
import debounce from 'lodash/debounce';
import { PAYMENT_MODES } from '../../pages/Payments/consts';
import offlinePaymentMethod from '../../pages/Payments/offlinePaymentMethod';
import i18n from '../../I18n';
import { FutureRidesContext } from '../futureRides';
import { UserContext } from '../user';
import PaymentContext from '../payments';
import { getPosition, DEFAULT_COORDS } from '../../services/geo';
import {
  getPlaces, getGeocode, getPlaceDetails,
} from './google-api';
import StorageService from '../../services/storage';
import Mixpanel from '../../services/Mixpanel';
import * as rideApi from './api';
import {
  formatEstimationsResult,
  formatStopPointsForEstimations,
  getEstimationTags,
  INITIAL_STOP_POINTS,
  RIDE_POPUPS, RidePopupNames, RIDE_FAILED_REASONS, ESTIMATION_ERRORS,
  convertTimezoneByLocation,
  RIDER_APP_SOURCE,
  FEEDBACK_TYPES,
  getRandomId,
} from './utils';
import settings from '../settings';
import SETTINGS_KEYS from '../settings/keys';
import { RideStateContextContext } from '../ridePageStateContext';
import { BS_PAGES } from '../ridePageStateContext/utils';
import {
  RIDE_STATES, RIDE_FINAL_STATES, STOP_POINT_TYPES, CHARGE_FOR_TIP,
} from '../../lib/commonTypes';
import useBackgroundInterval from '../../lib/useBackgroundInterval';
import { formatSps } from '../../lib/ride/utils';
import { MAIN_ROUTES } from '../../pages/routes';
import * as navigationService from '../../services/navigation';
import { BottomSheetContext } from '../bottomSheetContext';
import { VirtualStationsContext } from '../virtualStationsContext';


type Dispatch<A> = (value: A) => void;
type Nav = {
  navigate: (value: string, object?: any) => void;
}

interface RideFeedback {
  value: string;
  type: string;
  source: string;
}
export interface RideInterface {
  priceCurrency?: any;
  priceAmount?: any;
  id?: string;
  notes?: string;
  paymentMethodId?: string;
  serviceId?: string;
  scheduledTo?: string | number;
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
  rideFeedbacks?: RideFeedback[];
  cancellationReasonId?: string;
  businessAccountId?: string;
}

type AdditionalCharge = {
  amount: number,
  chargeFor: string,
}

type CalculationTypes = 'fixed' |'distance' | 'duration';

export type PriceCalculation = {
  totalPrice: number,
  currency: string,
  additionalCharges: AdditionalCharge[],
  items: [{pricingRule:
     {calculationType: CalculationTypes, price: number, name: string },
     cancellationRule:
     {calculationType: CalculationTypes, price: number, name: string },
     name: string,
     price: number}],
  distanceUnit: string,
  calculationBasis: string;
};

interface RidePageContextInterface {
  loadAddress: (input: any) => void;
  reverseLocationGeocode: (lat: number, lng: number) => Promise<any>;
  enrichPlaceWithLocation: (placeId: string) => any;
  selectedInputIndex: number | null;
  setSelectedInputIndex: Dispatch<number | null>;
  selectedInputTarget: any;
  setSelectedInputTarget: Dispatch<any | null>;
  onAddressSelected: (item: any, needToLoadRide: boolean, index?: number, refreshCurrentLocation?: boolean) => void;
  requestStopPoints: any[];
  searchResults: any;
  searchAddress: (searchText: string) => void;
  removeRequestSp: (index: number) => void;
  updateRequestSp: (sp: any) => void;
  addNewEmptyRequestSp: () => void;
  setSpCurrentLocation: () => void;
  historyResults: any[];
  serviceEstimations: any[];
  ride: RideInterface | null;
  updateRidePayload: (ride: any) => void;
  chosenService: any;
  defaultService: any;
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
  cleanRideState: (initSps: boolean) => void;
  setUnconfirmedPickupTime: Dispatch<number | null>;
  unconfirmedPickupTime: number | null;
  loadRide: (rideId: string) => Promise<void>;
  getRidePriceCalculation: (id: string | undefined, priceCalculationId?: string) => Promise<PriceCalculation | undefined>;
  getRideTotalPriceWithCurrency: (rideId : string | undefined) => Promise<{ amount: number; currency: string; } | undefined>;
  getRidesByParams: (params: any) => Promise<RideInterface[]>;
  numberOfPassengers: number | null,
  setNumberOfPassengers: (num: number) => void,
  setLastAcknowledgedRideCompletionTimestampToNow: () => void
  loadFutureBookingDays: () => void;
  futureBookingDays: number;
  businessAccountId: string | null,
  updateBusinessAccountId: (newBusinessAccountId: string | null) => void;
}

export const RidePageContext = createContext<RidePageContextInterface>({
  loadAddress: (input: any) => undefined,
  reverseLocationGeocode: async (lat: number, lng: number) => undefined,
  enrichPlaceWithLocation: (placeId: string) => undefined,
  selectedInputIndex: null,
  setSelectedInputIndex: () => undefined,
  selectedInputTarget: null,
  setSelectedInputTarget: () => undefined,
  onAddressSelected: (item: any, needToLoadRide: boolean, index?: number, refreshCurrentLocation?: boolean) => undefined,
  requestStopPoints: [],
  searchResults: [],
  searchAddress: (searchText: string) => undefined,
  updateRequestSp: (sp: any) => undefined,
  setSpCurrentLocation: () => undefined,
  historyResults: [],
  serviceEstimations: [],
  updateRidePayload: (ride: any) => undefined,
  chosenService: null,
  defaultService: null,
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
  getRidePriceCalculation: async () => undefined,
  getRideTotalPriceWithCurrency: async () => undefined,
  cleanRideState: (initSps: boolean) => undefined,
  setUnconfirmedPickupTime: () => undefined,
  unconfirmedPickupTime: null,
  loadRide: async (rideId: string) => undefined,
  getRidesByParams: async (params: any) => [],
  numberOfPassengers: null,
  setNumberOfPassengers: () => undefined,
  setLastAcknowledgedRideCompletionTimestampToNow: () => undefined,
  loadFutureBookingDays: () => undefined,
  futureBookingDays: 0,
  businessAccountId: null,
  updateBusinessAccountId: (newBusinessAccountId: string | null) => undefined,
  addNewEmptyRequestSp: () => undefined,
  removeRequestSp: (index: number) => undefined,
});

const HISTORY_RECORDS_NUM = 10;

const RidePageContextProvider = ({ children }: {
  children: any
}) => {
  const { getClientDefaultMethod } = PaymentContext.useContainer();
  const { locationGranted, user } = useContext(UserContext);
  const {
    isStationsEnabled,
    sortAndUpdateStations,
    sortStationsByDistanceUsingTurf,
    getStationList,
    stationsList,
  } = useContext(VirtualStationsContext);

  const navigation = useNavigation<Nav>();
  const { setGenericErrorDetails, setIsExpanded } = useContext(BottomSheetContext);
  const { checkStopPointsInTerritory, changeBsPage, currentBsPage } = useContext(RideStateContextContext);
  const { setNewFutureRide, loadFutureRides } = useContext(FutureRidesContext);
  const [requestStopPoints, setRequestStopPoints] = useState(INITIAL_STOP_POINTS);
  const [currentGeocode, setCurrentGeocode] = useState<any | null>(null);
  const [selectedInputIndex, setSelectedInputIndex] = useState<number | null>(null);
  const [selectedInputTarget, setSelectedInputTarget] = useState<any | null>(null);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [historyResults, setHistoryResults] = useState([]);
  const [serviceEstimations, setServiceEstimations] = useState<any | null>(null);
  const [ride, setRide] = useState<RideInterface>({});
  const [chosenService, setChosenService] = useState<any | null>(null);
  const [defaultService, setDefaultService] = useState<any | null>(null);
  const [lastSelectedLocation, saveSelectedLocation] = useState(false);
  const [rideRequestLoading, setRideRequestLoading] = useState(false);
  const [isAppActive, setIsAppActive] = useState(false);
  const [ridePopup, setRidePopup] = useState<RidePopupNames | null>(null);
  const [unconfirmedPickupTime, setUnconfirmedPickupTime] = useState<number | null>(null);
  const getRouteName = () => navigationService?.getNavigator()?.getCurrentRoute().name;
  const [numberOfPassengers, setNumberOfPassengers] = useState<number | null>(null);
  const [addressSearchLabel, setAddressSearchLabel] = useState<string | null>(null);
  const [futureBookingDays, setFutureBookingDays] = useState(0);
  const [businessAccountId, setBusinessAccountId] = useState<string | null>(null);

  const intervalRef = useRef<any>();

  const stopRequestInterval = () => {
    clearInterval(intervalRef.current);
  };
  const saveLastRide = async (rideId: string) => {
    await StorageService.save({ lastRideId: rideId });
  };
  const saveOrderedRidePaymentMethod = async (rideBusinessAccountId: string | null) => Promise.all([
    StorageService.save({ lastBusinessAccountId: rideBusinessAccountId || PAYMENT_MODES.PERSONAL }),
    StorageService.save({ orderedRide: true }),
  ]);


  const clearLastRide = async () => {
    await StorageService.delete('lastRideId');
  };

  const cleanRequestStopPoints = () => {
    setRequestStopPoints(INITIAL_STOP_POINTS);
    setChosenService(null);
    setDefaultService(null);
    setBusinessAccountId(null);
  };

  const cleanRideState = (initSpsBool = true) => {
    if (initSpsBool) {
      initSps();
    }
    setRide({});
    clearLastRide();
    setBusinessAccountId(null);
  };

  const onRideCompleted = (rideId: string, priceCalculationId: string) => {
    cleanRideState();
    if (getRouteName() !== 'CompletedRideOverviewPage') {
      navigationService.navigate(MAIN_ROUTES.POST_RIDE, { rideId, priceCalculationId });
    }
    setTimeout(() => {
      changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
    }, 500);
  };

  const RIDE_STATES_TO_SCREENS = {
    [RIDE_STATES.PENDING]: (pendingRide: RideInterface) => {
      setRide(pendingRide);
      changeBsPage(BS_PAGES.CONFIRMING_RIDE);
    },
    [RIDE_STATES.MATCHING]: (matchingRide: RideInterface) => {
      setRide(matchingRide);
      changeBsPage(BS_PAGES.CONFIRMING_RIDE);
    },
    [RIDE_STATES.REJECTED]: (rejectedRide: RideInterface) => {
      setRide(rejectedRide);
      changeBsPage(BS_PAGES.NO_AVAILABLE_VEHICLES);
    },
    [RIDE_STATES.COMPLETED]: (completedRide: any) => {
      onRideCompleted(completedRide.id, completedRide.priceCalculationId);
    },
    [RIDE_STATES.DISPATCHED]: (newRide: any) => {
      cleanRequestStopPoints();
      setRide(newRide);
      changeBsPage(BS_PAGES.ACTIVE_RIDE);
      saveLastRide(newRide.id);
    },
    [RIDE_STATES.ACTIVE]: (activeRide: any) => {
      cleanRequestStopPoints();
      setRide(activeRide);
      changeBsPage(BS_PAGES.ACTIVE_RIDE);
      saveLastRide(activeRide.id);
    },
    [RIDE_STATES.CANCELED]: (canceledRide: any) => {
      if (canceledRide.canceledBy !== user?.id) {
        setRidePopup(RIDE_POPUPS.RIDE_CANCELED_BY_DISPATCHER);
      }
    },
    [RIDE_STATES.FAILED]: () => {
      setRidePopup(RIDE_POPUPS.RIDE_CANCELED_BY_DISPATCHER);
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

  const { getSettingByKey, measureSystem } = settings.useContainer();


  const formatEstimations = (services: any[], estimations: any, tags: any): any => {
    const estimationsMap: any = {};
    estimations.map((e: any) => {
      estimationsMap[e.serviceId] = e;
    });
    const formattedServices = services.map((service) => {
      const estimationForService = estimationsMap[service.id];
      return formatEstimationsResult(service, estimationForService, tags);
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

  const updateRidePayload = (newRide: RideInterface) => {
    setRide({
      ...ride,
      ...newRide,
    });
  };

  const FAILED_ESTIMATIONS_ACTIONS = {
    [ESTIMATION_ERRORS['RIDE_VALIDATION:SOME_STOP_POINTS_ARE_OUT_OF_TERRITORY']]: () => changeBsPage(BS_PAGES.NOT_IN_TERRITORY),
    [ESTIMATION_ERRORS.FIRST_STOP_POINT_NOT_IN_TERRITORY]: () => changeBsPage(BS_PAGES.PICKUP_NOT_IN_TERRITORY),
    [ESTIMATION_ERRORS.CLIENT_NOT_IN_BUSINESS_ACCOUNT]: async () => {
      await StorageService.delete('lastBusinessAccountId');
      setBusinessAccountId(null);
      updateRidePayload({ paymentMethodId: undefined });
    },
  };


  const getLocationTimezoneTime = async (lat: number, lng:number, scheduledTime: Moment) => {
    const timezoneResponse = await convertTimezoneByLocation(lat, lng, scheduledTime);
    return timezoneResponse.time;
  };


  const getBusinessAccountIdWithFallback = async (paymentChosen: boolean) => {
    const doNotUseFallback = paymentChosen || businessAccountId;
    if (doNotUseFallback) {
      return businessAccountId;
    }
    const [notFirstRide, fallbackId] = await Promise.all([
      StorageService.get('orderedRide'),
      StorageService.get('lastBusinessAccountId'),
    ]);
    const defaultPaymentMethod = notFirstRide ? getClientDefaultMethod() : null;
    const usePersonalPayment = !fallbackId || fallbackId === PAYMENT_MODES.PERSONAL || defaultPaymentMethod;
    if (usePersonalPayment) { return null; }
    updateRidePayload({ paymentMethodId: offlinePaymentMethod.id });
    setBusinessAccountId(fallbackId);
    return fallbackId;
  };

  const getServiceEstimations = async (throwError = true, paymentChosen = true) => {
    const relevantBusinessAccountId = await getBusinessAccountIdWithFallback(paymentChosen);
    changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
    try {
      const formattedStopPoints = formatStopPointsForEstimations(requestStopPoints);
      Mixpanel.setEvent('Get service estimations');

      let scheduledTime: any = ride.scheduledTo;
      if (ride.scheduledTo) {
        const unixScheduledTo = moment.unix(Number(ride.scheduledTo) / 1000);
        scheduledTime = await getLocationTimezoneTime(formattedStopPoints[0].lat, formattedStopPoints[0].lng, unixScheduledTo);
      }
      const paymentMethodId = ride.paymentMethodId || getClientDefaultMethod(true, relevantBusinessAccountId)?.id;
      const { estimations, services } = await rideApi
        .createServiceEstimations(formattedStopPoints, scheduledTime, relevantBusinessAccountId, paymentMethodId);

      const tags = getEstimationTags(estimations);
      const formattedEstimations = formatEstimations(services, estimations, tags);
      const newChosenService = chosenService && formattedEstimations.find((e: any) => e.id === chosenService.id);
      setChosenService(newChosenService || formattedEstimations.find((e: any) => e.currency));
      setDefaultService(formattedEstimations?.[0]);
      setServiceEstimations(formattedEstimations);
    } catch (e: any) {
      Mixpanel.setEvent('service estimations failed', { status: e?.response?.status });
      if (throwError) {
        const error = e?.response?.data?.errors[0];
        const errorHandleFunction = FAILED_ESTIMATIONS_ACTIONS[error];
        if (errorHandleFunction) {
          Mixpanel.setEvent('service estimations failed with error reason', { error });
          await errorHandleFunction();
        } else {
          cleanRideState();
          setRidePopup(RIDE_POPUPS.FAILED_SERVICE_REQUEST);
          changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
          setIsExpanded(true);
        }
      }
      throw new Error();
    }
  };

  const getService = async (serviceId: string) => rideApi.getService(serviceId);

  const getServices = async () => rideApi.getServices();

  const getServiceEstimationsFetchingInterval = () => getSettingByKey(
    SETTINGS_KEYS.SERVICE_ESTIMATIONS_INTERVAL_IN_SECONDS,
  );
  const resetSearchResults = () => {
    if (isStationsEnabled) {
      setAddressLabelAndResults(null);
    } else {
      setSearchResults(null);
    }
  };

  const tryServiceEstimations = async (paymentChosen = true) => {
    const serviceEstimationsInterval = await getServiceEstimationsFetchingInterval();
    await getServiceEstimations(true, paymentChosen);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      if (intervalRef.current) {
        await getServiceEstimations(false, true);
      }
    }, ((serviceEstimationsInterval || 60) * 1000));
  };

  const validateStopPointInTerritory = (stopPoints: any[]) => checkStopPointsInTerritory(stopPoints);

  const validateRequestedStopPoints = (reqSps: any[], paymentChosen = true) => {
    const stopPoints = reqSps;
    const isSpsReady = stopPoints.every(r => r.lat && r.lng && r.description);
    if (stopPoints.length && isSpsReady) {
      tryServiceEstimations(paymentChosen);
    } else if (![BS_PAGES.ADDRESS_SELECTOR, BS_PAGES.LOADING].includes(currentBsPage)) {
      // reset req stop point request
      if (!ride.id) {
        changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
        setTimeout(() => {
          setIsExpanded(true);
        }, 100);
      }
    }
  };

  const setLastAcknowledgedRideCompletionTimestampToNow = () => {
    const now = moment().utc().toDate();
    return StorageService.save({ lastCompletedRideTimestamp: now }, 60 * 60 * 24 * 7);
  };

  const getRidesByParams = async (params: any) => rideApi.fetchRides(params);

  const loadFutureBookingDays = async () => {
    const maxDaysFromSettings = await getSettingByKey(SETTINGS_KEYS.MAX_DAYS_FOR_FUTURE_RIDE);
    setFutureBookingDays(maxDaysFromSettings);
  };

  const getLastCompletedRide = async () => {
    let lastTimestamp = await StorageService.get('lastCompletedRideTimestamp');
    if (!lastTimestamp) {
      lastTimestamp = moment().subtract(24, 'hour').toDate();
    }
    const rides = await rideApi.fetchRides({
      fromDate: lastTimestamp,
      toDate: moment().toDate(),
      pageNumber: 0,
      pageSize: 1,
      orderBy: 'updatedAt',
      sort: 'DESC',
      state: RIDE_STATES.COMPLETED,
    });

    await setLastAcknowledgedRideCompletionTimestampToNow();

    const [currentRide] = rides;
    if (currentRide) {
      const priceCalculation: any = await getRidePriceCalculation(currentRide.id, currentRide.priceCalculationId);
      const tip = priceCalculation?.additionalCharges.find(({ chargeFor }: any) => chargeFor === CHARGE_FOR_TIP);
      // check null because of zero
      if (currentRide.rating === null && !tip) {
        return currentRide;
      }
      return null;
    }
    return null;
  };

  const loadActiveRide = async () => {
    let activeRide;
    try {
      activeRide = await rideApi.getActiveRide();
    } catch (e) {}
    if (activeRide) {
      const formattedRide = await formatRide(activeRide);
      const screenFunction = RIDE_STATES_TO_SCREENS[formattedRide?.state || ''];
      if (screenFunction) {
        screenFunction(formattedRide);
      }
    } else {
      const lastRideId = await StorageService.get('lastRideId');
      if (lastRideId) {
        const lastRide = await rideApi.getRide(lastRideId);
        if (lastRide.state === RIDE_STATES.COMPLETED) {
          setTimeout(() => {
            onRideCompleted(lastRideId, lastRide.priceCalculationId);
          }, 1000);
        }
      }
      if (currentBsPage === BS_PAGES.LOADING) {
        changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
      }
    }
  };


  const loadLastCompletedRide = async () => {
    const completedRide = await getLastCompletedRide();
    if (completedRide?.id) {
      setTimeout(() => {
        onRideCompleted(completedRide?.id, completedRide?.priceCalculationId);
      }, 1000);
    }
  };

  useEffect(() => {
    if (isStationsEnabled) {
      initSps();
    }
  }, [isStationsEnabled, locationGranted]);

  useEffect(() => {
    if (user?.id) {
      loadActiveRide();
      loadLastCompletedRide();
    }
  }, [user?.id]);

  useEffect(() => {
    if (currentBsPage === BS_PAGES.SERVICE_ESTIMATIONS) {
      setServiceEstimations(null);
      tryServiceEstimations();
    }
  }, [businessAccountId]);

  useEffect(() => {
    setNumberOfPassengers(1);
  }, [chosenService]);

  useEffect(() => {
    if (user?.id && isAppActive && !ride.id) {
      loadLastCompletedRide();
    }
  }, [isAppActive]);

  const loadRide = async (rideId: string) => {
    const rideLoaded = await rideApi.getRide(rideId);
    const formattedRide = await formatRide(rideLoaded);
    if (ride.state !== rideLoaded.state) {
      Mixpanel.setEvent('New ride state', { oldState: ride.state, newState: rideLoaded.state });
      const screenFunction = RIDE_STATES_TO_SCREENS[rideLoaded.state];
      if (screenFunction) {
        screenFunction(rideLoaded);
      }
    }
    if (!RIDE_FINAL_STATES.includes(rideLoaded?.state || '')) {
      setRide(formattedRide);
    }
  };

  useBackgroundInterval(async () => {
    const appCurrentStateIsActive = AppState.currentState === 'active';
    setIsAppActive(appCurrentStateIsActive);
    if (appCurrentStateIsActive && user?.id && !rideRequestLoading) {
      if (ride?.id) {
        try {
          loadRide(ride.id);
        } catch (e) {
          console.log(e);
          cleanRideState();
          changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
        }
      } else {
        loadActiveRide();
      }
    }
  }, 4000);

  useEffect(() => {
    validateRequestedStopPoints(requestStopPoints, false);
  }, [requestStopPoints]);

  const getRideFromApi = async (rideId: string): Promise<RideInterface> => formatRide(await rideApi.getRide(rideId));

  useEffect(() => {
    if (unconfirmedPickupTime) {
      validateRequestedStopPoints(requestStopPoints);
    }
  }, [ride.scheduledTo]);

  const reverseLocationGeocode = async (pinLat: number | null = null, pinLng: number | null = null)
    : Promise<any | undefined> => {
    try {
      let location;
      if (pinLat && pinLng) {
        location = {
          lat: pinLat,
          lng: pinLng,
        };
      } else {
        const currentCoords = await getCurrentLocation();
        location = {
          lat: currentCoords.latitude,
          lng: currentCoords.longitude,
        };
      }
      const data = await getGeocode(location);

      const { placeId, formattedAddress } = data;
      const geoLocation = {
        placeId,
        streetAddress: formattedAddress,
        description: formattedAddress,
        lat: location.lat,
        lng: location.lng,
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
      return locationData;
    }
  };

  useEffect(() => {
    if (user?.id) {
      if (!locationGranted) {
        getCurrentLocation();
      } else {
        initCurrentLocation();
      }
    }
  }, [locationGranted]);

  const initSps = async () => {
    let currentAddress = null;
    const [closesStation] = getStationList();
    if (isStationsEnabled) {
      currentAddress = {
        externalId: closesStation.externalId,
        streetAddress: closesStation.label,
        description: closesStation.label,
        lat: closesStation.coordinates.lat,
        lng: closesStation.coordinates.lng,
      };
    } else {
      currentAddress = await getCurrentLocationAddress();
    }
    if (currentGeocode) {
      const sps = [...INITIAL_STOP_POINTS].map((s) => {
        if (s.useDefaultLocation) {
          return {
            ...s,
            externalId: currentAddress.externalId,
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
    if (user?.id) {
      if (requestStopPoints.filter((sp => sp.lat)).length <= 1) {
        initSps();
      }
    }
  }, [currentGeocode]);


  const updateRequestSp = (data: any[], index?: number | null) => {
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
  const addNewEmptyRequestSp = () => {
    setRequestStopPoints((oldRequestSps) => {
      const newRequestsSps = [...oldRequestSps];
      newRequestsSps.splice(requestStopPoints.length - 1, 0, {
        lat: null,
        lng: null,
        externalId: null,
        text: '',
        type: STOP_POINT_TYPES.STOP_POINT_PICKUP,
        id: getRandomId(),
      });
      return newRequestsSps;
    });
  };
  const removeRequestSp = (index : number) => {
    setRequestStopPoints((oldRequestSps) => {
      const newRequestsSps = [...oldRequestSps];
      newRequestsSps.splice(index, 1);
      return newRequestsSps;
    });
  };

  const setSpCurrentLocation = async () => {
    const newGeoLocation = await reverseLocationGeocode();
    if (isStationsEnabled) {
      updateRequestSp({
        description: newGeoLocation?.description,
        streetAddress: newGeoLocation?.streetAddress,
        externalId: null,
        lat: null,
        lng: null,
      });
      return true;
    }
    updateRequestSp(newGeoLocation, selectedInputIndex);
    return true;
  };

  const loadAddress = async (input: any) => {
    let currentCoords;
    if (locationGranted) {
      currentCoords = await getCurrentLocation();
    }
    try {
      const data = await getPlaces({
        input,
        radius: 20000,
        lat: currentCoords?.latitude || DEFAULT_COORDS.coords.latitude,
        lng: currentCoords?.longitude || DEFAULT_COORDS.coords.longitude,
      });
      return data?.sort((a: any, b: any) => (a.distance_meters - b.distance_meters));
    } catch (error) {
      console.log('Got error while try to get places', error);
      return undefined;
    }
  };

  const enrichPlaceWithLocation = async (placeId: string) => {
    try {
      const data = await getPlaceDetails(placeId);
      return data;
    } catch (error) {
      console.log('Got error while try to get places', error);
      return undefined;
    }
  };

  const onAddressSelected = async (selectedItem: any, needToLoadRide: boolean, index?: number, refreshCurrentLocation?: boolean) => {
    if (selectedItem.isLoading) {
      return null;
    }
    let enrichedPlace = {
      lat: selectedItem.lat,
      lng: selectedItem.lng,
    };
    if (!selectedItem.lat || !selectedItem.lng) {
      enrichedPlace = await enrichPlaceWithLocation(selectedItem.placeId);
    }
    const reqSps = [...requestStopPoints];
    if (refreshCurrentLocation) {
      const newCurrentLocation = await getCurrentLocationAddress();
      reqSps[0] = { ...reqSps[0], ...newCurrentLocation };
    }
    reqSps[index || selectedInputIndex || 0] = {
      ...reqSps[index || selectedInputIndex || 0],
      externalId: selectedItem.externalId,
      description: selectedItem.description || selectedItem.fullText,
      streetAddress: selectedItem.description || selectedItem.text,
      placeId: selectedItem.placeId,
      lat: enrichedPlace.lat,
      lng: enrichedPlace.lng,
    };

    resetSearchResults();

    if (needToLoadRide) {
      validateRequestedStopPoints(reqSps);
    }
    setRequestStopPoints(reqSps);
  };

  const getCurrentLocation = async () => {
    const location = await getPosition();
    if (!location) {
      if (!ride?.id) {
        changeBsPage(BS_PAGES.LOCATION_REQUEST);
      }
      return DEFAULT_COORDS.coords;
    }
    return location.coords;
  };

  const useGoogleSearch = async (searchText: string) => {
    if (searchText === null || searchText === '') {
      resetSearchResults();
    } else {
      const results = await loadAddress(searchText);
      const parsed = parseSearchResults(results);
      setSearchResults(parsed);
    }
  };


  const setAddressLabelAndResults = (label: string | null) => {
    setAddressSearchLabel(label);
  };

  const filterSelectedStations = (stations) => {
    const stopPointsExternalIds = requestStopPoints.map(sp => sp.externalId);
    const filteredStations = stations.filter(sp => !stopPointsExternalIds.includes(sp.externalId));
    return filteredStations;
  };

  const formatStationsList = useCallback((stations) => {
    const filteredStations = filterSelectedStations(stations);
    return filteredStations.map(formatStationToSearchResult);
  }, [requestStopPoints]);

  useEffect(() => {
    setSearchResults(formatStationsList(stationsList));
  }, [stationsList]);


  const useStationSearch = async (stopPoints, index) => {
    if (index !== null && stopPoints?.length) {
      const selected = stopPoints[index];

      if ((!selected.lat || !selected.lng) && selected?.description?.length) {
        await debouncedSearch(selected.description);
        return null;
      }

      const [pickup] = stopPoints;
      let result = {
        type: 'currentLocation',
        coords: null,
      };

      if (stopPoints[index].type === STOP_POINT_TYPES.STOP_POINT_DROPOFF) {
        if (pickup.lat && pickup.lng) {
          result = {
            type: STOP_POINT_TYPES.STOP_POINT_PICKUP,
            coords: {
              lat: pickup.lat,
              lng: pickup.lng,
            },
          };
        }
      }

      const { type, coords } = result;
      setAddressLabelAndResults(i18n.t(`virtualStations.search.${type}`));
      await getStationList(coords);
      return true;
    }
    resetSearchResults();
  };

  useEffect(() => {
    if (isStationsEnabled) {
      useStationSearch(requestStopPoints, selectedInputIndex);
    }
  }, [requestStopPoints, isStationsEnabled, selectedInputIndex]);

  const debouncedSearch = useCallback(debounce(async text => searchStation(text), 300), [isStationsEnabled]);
  const searchStation = async (searchTerm: string) => {
    const results = await loadAddress(searchTerm);
    if (results?.length) {
      const enrichedPlace = await enrichPlaceWithLocation(results[0].place_id);
      const [parsedResult] = parseSearchResults([results[0]]);
      getStationList(enrichedPlace);
      setAddressLabelAndResults(parsedResult.fullText);
    } else {
      setAddressLabelAndResults(
        i18n.t('virtualStations.search.addressNotFound'),
      );
      await getStationList();
    }
  };

  const formatStationToSearchResult = (station: any) => ({
    //    id: station.id,
    externalId: station.externalId,
    text: station.label,
    subText: station.address,
    fullText: station.label,
    lat: station.coordinates.lat,
    lng: station.coordinates.lng,
    // distance: formatDistanceByMeasurement(station.distance, measureSystem),
  });


  const searchAddress = async (searchText: string) => {
    if (!isStationsEnabled) {
      useGoogleSearch(searchText);
    }
  };

  const parseSearchResults = (results: any[]) => results.map((r) => {
    let formattedAddress = r.structured_formatting.main_text;
    if (r.structured_formatting.secondary_text) {
      formattedAddress = `${formattedAddress}, ${r.structured_formatting.secondary_text}`;
    }

    return {
      text: r.structured_formatting.main_text,
      subText: r.structured_formatting.secondary_text,
      fullText: formattedAddress,
      placeId: r.place_id,
      description: r.description,
    };
  });

  const saveLastAddresses = async (items: any[]) => {
    const history: any[] = await getLastAddresses();
    const uniqueItems = items.filter((item, index) => items.findIndex(i => i.placeId === item.placeId) === index);
    const filteredHistory = (history || []).filter(h => items.every(item => h.placeId !== item.placeId));
    filteredHistory.unshift(...uniqueItems);
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

  const backToServiceEstimations = () => {
    tryServiceEstimations();
    changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
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
          backToServiceEstimations();
        },
      });
      changeBsPage(BS_PAGES.GENERIC_ERROR);
    },
    // mocks for now
    [RIDE_FAILED_REASONS.USER_HAS_OUTSTANDING_BALANCE]: () => {
      setGenericErrorDetails({
        subtitleTestId: 'outstandingBalanceError',
        titleText: i18n.t('bottomSheetContent.outstandingBalance.titleText'),
        buttonText: i18n.t('bottomSheetContent.outstandingBalance.buttonText'),
        subTitleText: i18n.t('bottomSheetContent.outstandingBalance.subTitleText'),
        buttonPress: () => {
          changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
          navigationService.navigate(MAIN_ROUTES.CONTACT_US);
        },
      });
      changeBsPage(BS_PAGES.GENERIC_ERROR);
    },
    [RIDE_FAILED_REASONS.CASH_NOT_ALLOWED]: () => {
      setGenericErrorDetails({
        titleText: i18n.t('bottomSheetContent.cashNotAllowed.titleText'),
        buttonText: i18n.t('bottomSheetContent.cashNotAllowed.buttonText'),
        subTitleText: i18n.t('bottomSheetContent.cashNotAllowed.subTitleText'),
        buttonPress: () => {
          backToServiceEstimations();
        },
      });
      changeBsPage(BS_PAGES.GENERIC_ERROR);
    },
    [RIDE_FAILED_REASONS.PAYMENT_METHOD_EXPIRED]: () => {
      setGenericErrorDetails({
        titleText: i18n.t('bottomSheetContent.paymentMethodExpired.titleText'),
        buttonText: i18n.t('bottomSheetContent.paymentMethodExpired.buttonText'),
        subTitleText: i18n.t('bottomSheetContent.paymentMethodExpired.subTitleText'),
        buttonPress: () => {
          backToServiceEstimations();
        },
      });
      changeBsPage(BS_PAGES.GENERIC_ERROR);
    },
    [RIDE_FAILED_REASONS.COULD_NOT_CREATE_PAYMENT_INTENT]: () => {
      setGenericErrorDetails({
        titleText: i18n.t('bottomSheetContent.paymentIntentError.titleText'),
        buttonText: i18n.t('bottomSheetContent.paymentIntentError.buttonText'),
        subTitleText: i18n.t('bottomSheetContent.paymentIntentError.subTitleText'),
        buttonPress: () => {
          backToServiceEstimations();
        },
      });
      changeBsPage(BS_PAGES.GENERIC_ERROR);
    },
    [RIDE_FAILED_REASONS.USER_ACTIVE_RIDE_LIMIT_REACHED]: () => {
      loadActiveRide();
    },
  };

  const requestRide = async (pickupLocation?: any): Promise<void> => {
    Mixpanel.setEvent('Requesting ride');
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
    const allSpsExceptFirstPickup = stopPoints.slice(1);
    const allSpsExceptFirstPickupDefined = allSpsExceptFirstPickup.filter(sp => sp && sp.lat);
    saveLastAddresses(allSpsExceptFirstPickupDefined.map(sp => ({
      text: sp.streetAddress || sp.description,
      fullText: sp.streetAddress || sp.description,
      placeId: sp.placeId,
      externalId: sp.externalId,
      lat: sp.lat,
      lng: sp.lng,
    })));

    try {
      let scheduledToMoment = ride.scheduledTo;
      if (ride.scheduledTo) {
        const unixScheduledTo = moment.unix(Number(ride.scheduledTo) / 1000);
        scheduledToMoment = await getLocationTimezoneTime(pickupLocation.lat, pickupLocation.lng, unixScheduledTo);
      }
      const rideToCreate = {
        serviceId: chosenService?.id,
        estimationId: chosenService?.estimationId,
        paymentMethodId: ride.paymentMethodId,
        rideType: 'passenger',
        numberOfPassengers,
        ...(ride.scheduledTo && { scheduledTo: scheduledToMoment }),
        stopPoints: stopPoints.map((sp, i) => ({
          lat: Number(sp.lat),
          lng: Number(sp.lng),
          description: sp.streetAddress || sp.description,
          type: sp.type,
          ...(i === 0 && { notes: ride.notes }),
        })),
        ...(businessAccountId ? { businessAccountId } : {}),
      };


      const [afRide] = await Promise.all([
        rideApi.createRide(rideToCreate),
        saveOrderedRidePaymentMethod(businessAccountId),
      ]);
      if (afRide.state === RIDE_STATES.REJECTED) {
        throw new Error(RIDE_FAILED_REASONS.BUSY);
      }
      if (afRide.scheduledTo) {
        loadFutureRides();
        setNewFutureRide({ ...afRide, scheduledTo: scheduledToMoment });
        changeBsPage(BS_PAGES.CONFIRM_FUTURE_RIDE);
      } else {
        const formattedRide = await formatRide(afRide);
        setRide(formattedRide);
      }
    } catch (e: any) {
      const key = e.response?.data?.errors[0] || e.message;
      Mixpanel.setEvent('Ride failed', { status: e?.response?.status, reason: key });
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


  const patchRideRating = async (rideId: string, rating: number | null, feedback: RideFeedback | null): Promise<any> => {
    if (!rating && !feedback) {
      return null;
    }

    try {
      const updatedRide = await rideApi.patchRide(rideId, {
        rating,
        feedback,
      });
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
    if (!tip) {
      return null;
    }

    try {
      await rideApi.additionalCharge(priceCalculationId, tip, 'tip');
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const buildRideFeedbackObject = (rideFeedbackText: string) => ({
    source: RIDER_APP_SOURCE,
    type: FEEDBACK_TYPES.FREE_TEXT,
    value: rideFeedbackText,
  });

  const postRideSubmit = async (rideId: string, ridePayload: any): Promise<boolean> => {
    const {
      priceCalculationId, rating, tip, rideFeedbackText,
    } = ridePayload;
    console.log('Post Ride Data', {
      rideId, priceCalculationId, rating, tip, rideFeedbackText,
    });
    const rideFeedbackObject: RideFeedback | null = rideFeedbackText ? buildRideFeedbackObject(rideFeedbackText) : null;
    await Promise.all([
      setLastAcknowledgedRideCompletionTimestampToNow(),
      chargeTip(priceCalculationId, tip),
      patchRideRating(rideId, rating, rideFeedbackObject),
    ]);
    return true;
  };

  const updateRide = async (rideId: string | undefined, newRide: RideInterface) => {
    try {
      Mixpanel.setEvent('Trying to update ride', newRide);
      await rideApi.patchRide(rideId, newRide);
    } catch (e) {
      Mixpanel.setEvent('Failed to update ride');
    }
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
          number = ride?.driver?.phoneNumber;
        }
      }
      Mixpanel.setEvent('tel', { number });
      return number;
    }
    return null;
  };

  const getRidePriceCalculation = async (
    id?: string | undefined,
    priceCalculationId?: string,
  ) => {
    if (id || ride?.id) {
      let finalPriceCalculation = priceCalculationId || ride?.priceCalculationId;
      if (!finalPriceCalculation) {
        ({ priceCalculationId: finalPriceCalculation } = await getRideFromApi(id || ride.id || ''));
      }
      const calculation = await rideApi.getPriceCalculation(finalPriceCalculation);
      return calculation;
    }
    return null;
  };

  const getRideTotalPriceWithCurrency = async (rideId: string | undefined) => {
    if (!rideId) {
      return { amount: 0, currency: '' };
    }
    const apiRide = await getRideFromApi(rideId);
    const calculation = (await rideApi.getPriceCalculation(apiRide?.priceCalculationId)) as PriceCalculation;
    return {
      amount:
      (calculation?.totalPrice || 0)
     + (calculation?.additionalCharges?.reduce((s, { amount }) => s + amount, 0) || 0),
      currency: calculation.currency,
    };
  };

  const clearRequestSp = (index: number) => {
    updateRequestSp({
      lat: null,
      lng: null,
      externalId: null,
      description: null,
      streetAddress: null,
    }, index);
  };
  const updateBusinessAccountId = (newBusinessAccountId: string | null) => {
    if (newBusinessAccountId !== businessAccountId) {
      setBusinessAccountId(newBusinessAccountId);
    }
  };

  return (
    <RidePageContext.Provider
      value={{
        getRideTotalPriceWithCurrency,
        requestRide,
        loadAddress,
        reverseLocationGeocode,
        enrichPlaceWithLocation,
        selectedInputIndex,
        setSelectedInputIndex,
        selectedInputTarget,
        setSelectedInputTarget,
        onAddressSelected,
        requestStopPoints,
        searchResults,
        searchAddress,
        updateRequestSp,
        setRequestStopPoints,
        addNewEmptyRequestSp,
        removeRequestSp,
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
        defaultService,
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
        getRidePriceCalculation,
        cleanRideState,
        setUnconfirmedPickupTime,
        unconfirmedPickupTime,
        loadRide,
        getRidesByParams,
        numberOfPassengers,
        setNumberOfPassengers,
        addressSearchLabel,
        formatStationToSearchResult,
        formatStationsList,
        clearRequestSp,
        setLastAcknowledgedRideCompletionTimestampToNow,
        loadFutureBookingDays,
        futureBookingDays,
        businessAccountId,
        updateBusinessAccountId,
      }}
    >
      {children}
    </RidePageContext.Provider>
  );
};

export default RidePageContextProvider;
