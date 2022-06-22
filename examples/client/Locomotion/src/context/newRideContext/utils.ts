import moment from 'moment';
import i18n from '../../I18n';

export const TAG_OPTIONS = {
  FASTEST: i18n.t('services.tags.fastest'),
  CHEAPEST: i18n.t('services.tags.cheapest'),
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

export const formatEstimationsResult = (service, estimationResult, tags) => {
  const estimation = estimationResult || {};
  return {
    id: service.id,
    name: service.displayName,
    eta: estimation.minPickupEta,
    price: estimation.priceAmount,
    currency: estimation.priceCurrency,
    availableSeats: service.maxPassengers || 4,
    tag: Object.entries(tags).map(([key, value]) => value === service.id && key),
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
