import moment from 'moment';
import shortid from 'shortid';
import i18n from '../../I18n';
import { getGeocode, getLocationTimezone } from './google-api';

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
};

export const getFutureRideMinDate = (minutesBefore: number) => moment().add(minutesBefore, 'minutes').toDate();
export const getFutureRideMaxDate = () => moment().add(7, 'days').toDate();

export const TAG_OPTIONS = {
  FASTEST: i18n.t('services.tags.fastest'),
  CHEAPEST: i18n.t('services.tags.cheapest'),
};

export type RidePopupNames = 'FAILED_SERVICE_REQUEST' | 'RIDE_CANCELED_BY_DISPATCHER';

export const RIDE_POPUPS: {[key: string]: RidePopupNames} = {
  FAILED_SERVICE_REQUEST: 'FAILED_SERVICE_REQUEST',
  RIDE_CANCELED_BY_DISPATCHER: 'RIDE_CANCELED_BY_DISPATCHER',
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
  const location = `${lat},${lng}`;
  const data = await getGeocode({
    latlng: location,
  });
  return data.results[0].formatted_address;
};

export const isPriceEstimated = (priceCalculationBasis: string) => priceCalculationBasis === 'actual';

export const formatEstimationsResult = (service: any, estimationResult: any, tags: any) => {
  const estimation = estimationResult || {};
  return {
    id: service.id,
    priceCalculationId: estimation.priceCalculationId,
    name: service.displayName,
    eta: estimation.minPickupEta,
    price: estimation.priceAmount,
    currency: estimation.currency,
    isPriceEstimated: isPriceEstimated(estimation.priceCalculationBasis),
    availableSeats: service.maxPassengers || 4,
    tag: (Object.entries(tags).find(([, value]) => value === service.id) || [])[0],
    iconUrl: service.icon,
    description: service.displayDescription,
    priority: service.priority,
    serviceAvailabilitiesNumber: service.serviceAvailabilities.length,
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
  lat: number,
  lng: number,
  momentDate: any,
  keepTime = true,
) => {
  const convertedZone = momentDate.clone();
  const timezoneResponse = await getLocationTimezone(lat, lng, momentDate);
  const { timeZoneId } = timezoneResponse;

  return convertedZone.tz(timeZoneId, keepTime).format();
};
