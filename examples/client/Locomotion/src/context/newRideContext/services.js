import i18n from '../../I18n';

export const TAG_OPTIONS = {
  FASTEST: i18n.t('services.tags.fastest'),
  CHEAPEST: i18n.t('services.tags.cheapest'),
};

export const formatEstimationsResult = (service, estimationResult) => {
  const estimation = estimationResult || {};
  return {
    id: service.id,
    name: service.displayName,
    eta: estimation.minPickupEta,
    price: estimation.priceAmount,
    currency: estimation.priceCurrency,
    availableSeats: service.maxPassengers || 4,
    tag: null,
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
