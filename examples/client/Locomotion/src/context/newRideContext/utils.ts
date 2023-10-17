import moment from 'moment';
import shortid from 'shortid';
import i18n from '../../I18n';
import { getGeocode } from './google-api';
import { getLocationTimezone } from './api';

export const ESTIMATION_ERRORS = {
  'RIDE_VALIDATION:SOME_STOP_POINTS_ARE_OUT_OF_TERRITORY': 'RIDE_VALIDATION:SOME_STOP_POINTS_ARE_OUT_OF_TERRITORY',
  FIRST_STOP_POINT_NOT_IN_TERRITORY: 'FIRST_STOP_POINT_NOT_IN_TERRITORY',
};

export const RIDE_FAILED_REASONS = {
  BUSY: 'BUSY',
  USER_FUTURE_RIDE_INTERVAL_LIMIT_REACHED: 'USER_FUTURE_RIDE_INTERVAL_LIMIT_REACHED',
  USER_HAS_OUTSTANDING_BALANCE: 'USER_HAS_OUTSTANDING_BALANCE',
  CASH_NOT_ALLOWED: 'CASH_NOT_ALLOWED',
  PAYMENT_METHOD_EXPIRED: 'PAYMENT_METHOD_EXPIRED',
  COULD_NOT_CREATE_PAYMENT_INTENT: 'COULD_NOT_CREATE_PAYMENT_INTENT',
  USER_ACTIVE_RIDE_LIMIT_REACHED: 'USER_ACTIVE_RIDE_LIMIT_REACHED',
};

export const FEEDBACK_TYPES = {
  FREE_TEXT: 'FREE_TEXT',
};

export const RIDER_APP_SOURCE = 'RIDER_APP';

export const getFutureRideMinDate = (minutesBefore: number) => moment().add(minutesBefore, 'minutes').toDate();
export const getFutureRideMaxDate = (daysAfter: number) => moment().add(daysAfter, 'days').toDate();

export const TAG_OPTIONS = {
  FASTEST: i18n.t('services.tags.fastest'),
  CHEAPEST: i18n.t('services.tags.cheapest'),
};

export type RidePopupNames = 'FAILED_SERVICE_REQUEST' | 'RIDE_CANCELED_BY_DISPATCHER' | 'CANCELLATION_REASON';

export const RIDE_POPUPS: {[key: string]: RidePopupNames} = {
  FAILED_SERVICE_REQUEST: 'FAILED_SERVICE_REQUEST',
  RIDE_CANCELED_BY_DISPATCHER: 'RIDE_CANCELED_BY_DISPATCHER',
  CANCELLATION_REASON: 'CANCELLATION_REASON',
};

export const INITIAL_STOP_POINTS = [{
  type: 'pickup',
  lat: null,
  lng: null,
  useDefaultLocation: true,
  id: shortid.generate(),
  description: null,
  streetAddress: null,
  placeId: null,
},
{
  type: 'dropoff',
  lat: null,
  lng: null,
  useDefaultLocation: false,
  id: shortid.generate(),
  description: null,
  streetAddress: null,
  placeId: null,
}];


export const buildStreetAddress = (data: any) => {
  const streetAddress: any = {};
  data.results[0].address_components.map((ac: any) => {
    if (ac.types.includes('street_number')) {
      streetAddress.number = ac.long_name;
    }
    if (ac.types.includes('route')) {
      streetAddress.name = ac.long_name;
    }
  });
  if (!streetAddress.name && !streetAddress.number) {
    return undefined;
  }
  return `${streetAddress.name || ''} ${streetAddress.number || ''}`;
};

export const getEstimationTags = (estimations: any[]) => {
  const tags: any = {
    fastest: {},
    cheapest: {},
  };
  estimations.map((estimation) => {
    const e = estimation[0];
    if (!e) {
      return;
    }
    if (tags.fastest) {
      if ((!tags.fastest.eta || moment(e.minPickupEta).isBefore(tags.fastest.eta))) {
        tags.fastest = {
          eta: e.maxPickupEta,
          serviceId: e.serviceId,
        };
      } else if (moment(e.minPickupEta).isSame(tags.fastest.eta)) {
        tags.fastest = null;
      }
    }
    if (tags.cheapest) {
      if (!tags.cheapest.eta || e.priceAmount < tags.cheapest.price) {
        tags.cheapest = {
          price: e.priceAmount,
          serviceId: e.serviceId,
        };
      } else if (e.priceAmount === tags.cheapest.price) {
        tags.cheapest = null;
      }
    }
  });
  if (tags.cheapest && tags.cheapest?.serviceId === tags.fastest?.serviceId) {
    tags.cheapest.serviceId = null;
  }
  return {
    [TAG_OPTIONS.CHEAPEST]: tags.cheapest?.serviceId,
    [TAG_OPTIONS.FASTEST]: tags.fastest?.serviceId,
  };
};

export const latLngToAddress = async (lat: string, lng: string) => {
  const data = await getGeocode({
    lat,
    lng,
  });
  return data.formattedAddress;
};

export const isPriceEstimated = (priceCalculationBasis: string) => priceCalculationBasis === 'actual';

export const formatEstimationsResult = (service: any, estimationResult: any, tags: any) => {
  const estimation = estimationResult || {};
  return {
    id: service.id,
    priceCalculationId:
      estimation.priceCalculationId || estimation.highEtaAsapRide?.priceCalculationId,
    estimationId: estimation.id,
    name: service.displayName,
    eta: estimation.minPickupEta,
    price: estimation.priceAmount || estimation.highEtaAsapRide?.priceAmount,
    currency: estimation.currency || estimation.highEtaAsapRide?.currency,
    isPriceEstimated: isPriceEstimated(
      estimation.priceCalculationBasis || estimation.highEtaAsapRide?.priceCalculationBasis,
    ),
    availableSeats: service.maxPassengers || 4,
    tag: (Object.entries(tags).find(([, value]) => value === service.id) || [])[0],
    iconUrl: service.icon,
    description: service.displayDescription,
    priority: service.priority,
    serviceAvailabilitiesNumber: service.serviceAvailabilities.length,
    outOfTerritory: service.serviceTerritories?.some((st: any) => st.alwaysShow),
    pooling: service.pooling,
    pickupWindowSizeInMinutes: service.pickupWindowSizeInMinutes,
    futurePickupWindowSizeInMinutes: service.futurePickupWindowSizeInMinutesWithFallback,
    isHighEtaAsapRide: !!estimation.highEtaAsapRide,
    allowRideOrderIfNoVehiclesMatched: service.allowRideOrderIfNoVehiclesMatched,
    allowedPaymentMethods: service.clientAllowedPaymentMethods || [],
  };
};

export const formatStopPointsForEstimations = (requestStopPoints: any[]) => requestStopPoints.map(sp => ({
  type: sp.type,
  lat: sp.lat,
  lng: sp.lng,
}));

export const getFormattedPrice = (priceCurrency: string | undefined, priceAmount: number) => {
  if (!priceCurrency) {
    return i18n.t('rideDetails.noCharge');
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: priceCurrency }).format(priceAmount);
};


export const getCurrencySymbol = (priceCurrency?: string) => {
  if (!priceCurrency) {
    return '';
  }
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: priceCurrency }).format(0);
  return currency[0];
};

export const convertTimezoneByLocation = async (
  lat: any,
  lng: any,
  momentDate: any,
  keepTime = true,
) => {
  try {
    const convertedZone = momentDate.clone();
    const timezoneResponse: any = await getLocationTimezone(lat, lng);
    const { timezone } = timezoneResponse;
    return {
      time: convertedZone.tz(timezone, keepTime).format(),
      timezone,
    };
  } catch (e) {
    throw new Error('Could not fetch timezone from server');
  }
};

export const didUserRate = (rating: string | null, rideFeedback: any[] | null) => rating || rideFeedback?.length;

const convertKmToMiles = (km: number) => km * 0.621371;

export const formatDistanceByMeasurement = (distanceInMeters: number, measurement = 'metric') => {
  const suffix = measurement === 'imperial' ? 'mi' : 'km';

  let distance = (distanceInMeters / 1000);

  if (!distance) {
    return null;
  }

  if (measurement === 'imperial') {
    distance *= 0.621371;
  }

  return `${distance.toFixed(2)} ${suffix}`;
};

export const getRandomId = () => shortid.generate();
