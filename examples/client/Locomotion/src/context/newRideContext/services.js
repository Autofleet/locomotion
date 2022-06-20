export const TAG_OPTIONS = {
  FASTEST: 'Fastest',
  CHEAPEST: 'Cheapest',
};

export const formatEstimationsResult = (service, estimationResult) => {
  return {
    name: service.displayName,
    eta: (estimationResult || {}).minPickupEta,
    price: (estimationResult || {}).priceAmount,
    availableSeats: service.maxPassengers || 4,
    tag: null,
    iconUrl: service.icon,
    description: service.displayDescription,
  }
}

export const formatStopPointsForEstimations = (requestStopPoints) => {
  return requestStopPoints.map(sp => ({
    type: sp.type,
    lat: sp.location.lat,
    lng: sp.location.lng,
  }));
}