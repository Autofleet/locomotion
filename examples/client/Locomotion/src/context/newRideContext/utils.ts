import moment from 'moment';
import shortid from 'shortid';
import i18n from '../../I18n';
import { getGeocode } from './google-api';

export const TAG_OPTIONS = {
  FASTEST: i18n.t('services.tags.fastest'),
  CHEAPEST: i18n.t('services.tags.cheapest'),
};

export const INITIAL_STOP_POINTS = [{
  type: 'pickup',
  lat: null,
  lng: null,
  useDefaultLocation: true,
  id: shortid.generate(),
},
{
  type: 'dropoff',
  lat: null,
  lng: null,
  useDefaultLocation: false,
  id: shortid.generate(),
}];


export const buildStreetAddress = (data) => {
  const streetAddress: any = {};
  data.results[0].address_components.map((ac) => {
    if (ac.types.includes('street_number')) {
      streetAddress.number = ac.long_name;
    }
    if (ac.types.includes('route')) {
      streetAddress.name = ac.long_name;
    }
  });
  return `${streetAddress.name} ${streetAddress.number}`;
};

export const getEstimationTags = (estimations) => {
  const tags: any = {
    fastest: {},
    cheapest: {},
  };
  estimations.map((e) => {
    if (!tags.fastest.eta || moment(e.minPickupEta).isBefore(tags.fastest.eta)) {
      tags.fastest = {
        eta: e.eta,
        serviceId: e.serviceId,
      };
    }
    if (!tags.cheapest.eta || e.priceAmount < tags.cheapest.price) {
      tags.cheapest = {
        price: e.priceAmount,
        serviceId: e.serviceId,
      };
    }
  });
  return {
    [TAG_OPTIONS.CHEAPEST]: tags.cheapest.serviceId,
    [TAG_OPTIONS.FASTEST]: tags.fastest.serviceId,
  };
};

export const latLngToAddress = async (lat, lng) => {
  const location = `${lat},${lng}`;
  const data = await getGeocode({
    latlng: location,
  });
  return data.results[0].formatted_address;
};

export const formatEstimationsResult = (service, estimationResult, tags) => {
  const estimation = estimationResult || {};
  return {
    id: service.id,
    name: service.displayName,
    eta: estimation.minPickupEta,
    price: estimation.priceAmount,
    currency: estimation.priceCurrency,
    availableSeats: service.maxPassengers || 4,
    tags: Object.entries(tags).map(([key, value]) => value === service.id && key),
    iconUrl: service.icon,
    description: service.displayDescription,
    priority: service.priority,
  };
};

export const formatStopPointsForEstimations = requestStopPoints => requestStopPoints.map(sp => ({
  type: sp.type,
  lat: sp.lat,
  lng: sp.lng,
}));
