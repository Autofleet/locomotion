import shortid from 'shortid';
import i18n from '../../I18n';

export const TAG_OPTIONS = {
  FASTEST: i18n.t('services.tags.fastest'),
  CHEAPEST: i18n.t('services.tags.cheapest'),
};

export const INITIAL_STOP_POINTS = [{
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
}];

export const formatEstimationsResult = (service, estimationResult) => ({
  id: service.id,
  name: service.displayName,
  eta: (estimationResult || {}).minPickupEta,
  price: (estimationResult || {}).priceAmount,
  availableSeats: service.maxPassengers || 4,
  tag: null,
  iconUrl: service.icon,
  description: service.displayDescription,
});

export const formatStopPointsForEstimations = requestStopPoints => requestStopPoints.map(sp => ({
  type: sp.type,
  lat: sp.location.lat,
  lng: sp.location.lng,
}));
