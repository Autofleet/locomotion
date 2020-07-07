const serializeStopPoint = (stopPoint, webhookUrl) => ({
  id: stopPoint.id,
  type: stopPoint.type,
  description: stopPoint.description,
  lat: stopPoint.lat,
  lng: stopPoint.lng,
  contact_person: stopPoint.contactPersonName,
  contact_person_phone: stopPoint.contactPersonPhone,
  contact_person_avatar: stopPoint.contactPersonAvatar,
  external_id: stopPoint.externalId,
  notes: stopPoint.notes,
  eta: stopPoint.eta,
  polyline: stopPoint.polyline,
  created_at: stopPoint.created_at,
  updated_at: stopPoint.updated_at,
  arrived_at: stopPoint.arrivedAt,
  started_at: stopPoint.startedAt,
  completed_at: stopPoint.completedAt,
  canceled_at: stopPoint.canceledAt,
  ride_id: stopPoint.ride_id,
  webhook_url: webhookUrl,
  vehicle_id: stopPoint.vehicleId,
  state: stopPoint.state,
  actual_distance: stopPoint.actualDistance,
  actual_lat: stopPoint.actualLat,
  actual_lng: stopPoint.actualLng,
  demand_source_external_id: stopPoint.demandSourceExternalId,
});

const serializeFee = fee => ({
  id: fee.id,
  type: fee.type,
  amount: fee.amount,
  price: fee.price,
  currency: fee.currency,
  start_time: fee.startTime,
  end_time: fee.endTime,
  start_lat: fee.startLat,
  start_lng: fee.startLng,
  end_lat: fee.endLat,
  end_lng: fee.endLng,
  added_by: fee.addedBy,
});

const serializeDemandSource = demandSource => ({
  id: demandSource.id,
  name: demandSource.name,
  description: demandSource.description,
  external_id: demandSource.externalId,
  logo: demandSource.logo,
  created_at: demandSource.created_at,
  updated_at: demandSource.updated_at,
});

const serializeRide = (ride) => {
  const serializedRide = {
    id: ride.id,
    external_id: ride.externalId,
    status: ride.state,
    cancelled_by: ride.cancelledBy,
    cancellation_reason: ride.cancellationReason,
    rating: ride.rating,
    fleet_id: ride.fleetId,
    demand_source_id: ride.demandSourceId,
    vehicle_class_id: ride.vehicleClassId,
    vehicle_id: ride.vehicleId,
    driver_id: ride.driverId,
    rated_at: ride.ratedAt,
    price_currency: ride.priceCurrency,
    price_amount: ride.priceAmount,
    created_at: ride.created_at,
    updated_at: ride.updated_at,
    pooling: ride.pooling,
    number_of_passengers: ride.numberOfPassengers,
    stop_points: (ride.stopPoints ?
      ride.stopPoints.map(sp => serializeStopPoint(sp, ride.webhookUrl)) : undefined),
    fees: (ride.fees ?
      ride.fees.map(fee => serializeFee(fee)) : undefined),
    demand_source: (ride.demandSource ? serializeDemandSource(ride.demandSource) : undefined),
    webhook_url: ride.webhookUrl,
    business_model_id: ride.businessModelId,
    scheduled_to: ride.scheduledTo,

  };
  serializedRide.price = (!ride.priceCurrency || !ride.priceAmount) ? undefined : {
    currency: ride.priceCurrency,
    amount: ride.priceAmount,
  };
  serializedRide.vehicle = ride.vehicle ? {
    id: ride.vehicle.id,
    image: ride.vehicle.image,
    license_plate: ride.vehicle.licensePlate,
    license_plate_state: ride.vehicle.licensePlateState,
    license_number: ride.vehicle.licenseNumber,
    license_expiry: ride.vehicle.licenseExpiry,
    model: ride.vehicle.model ? ride.vehicle.model.name : undefined,
    seats: ride.vehicle.seats,
    color: ride.vehicle.color,
    class: ride.vehicle.class,
    location: ride.vehicle.location ? {
      lat: ride.vehicle.location.lat,
      lng: ride.vehicle.location.lng,
      bearing: ride.vehicle.location.bearing,
    } : undefined,
  } : undefined;
  serializedRide.driver = ride.driver ? {
    id: ride.driver.id,
    first_name: ride.driver.firstName,
    last_name: ride.driver.lastName,
    phone_number: ride.driver.phoneNumber,
    avatar: ride.driver.avatar,
    rank: ride.driver.rank,
    license: ride.driver.license, // ride.driver.license
  } : undefined;

  serializedRide.fleet = ride.fleet ? {
    fleet_name: ride.fleet.fleetName,
    fleet_tin: ride.fleet.fleetTin,
    fleet_phone_number: ride.fleet.fleetOperationsPhoneNumber,
  } : undefined;


  return serializedRide;
};


const deserializeStopPoint = (stopPoint, webhookUrl) => ({
  id: stopPoint.id,
  type: stopPoint.type,
  description: stopPoint.description,
  lat: stopPoint.lat,
  lng: stopPoint.lng,
  contactPersonName: stopPoint.contact_person,
  contactPersonPhone: stopPoint.contact_person_phone,
  contactPersonAvatar: stopPoint.contact_person_avatar,
  notes: stopPoint.notes,
  externalId: stopPoint.external_id,
  eta: stopPoint.eta,
  webhookUrl,
  demandSourceExternalId: stopPoint.demand_source_external_id,
  afterTime: stopPoint.afterTime,
});

const deserializeRide = (ride) => {
  const serializedRide = {
    id: ride.id,
    externalId: ride.external_id,
    status: ride.state,
    cancelledBy: ride.cancelled_by,
    rating: ride.rating,
    stopPoints: ride.stop_points ?
      ride.stop_points.map(sp => deserializeStopPoint(sp, ride.webhook_url)) :
      undefined,
    priceCurrency: ride.price ? ride.price.currency : undefined,
    priceAmount: ride.price ? ride.price.amount : undefined,
    webhookUrl: ride.webhook_url,
    offerId: ride.offer_id,
    pooling: ride.pooling,
    numberOfPassengers: ride.number_of_passengers,
    maxEta: ride.max_eta,
    rideType: 'passenger',
  };
  return serializedRide;
};

const deserializeData = (data) => {
  const serializedData = {
    priceCurrency: data.price ? data.price.currency : undefined,
    priceAmount: data.price ? data.price.amount : undefined,
    contactPersonName: data.contact_person,
    contactPersonPhone: data.contact_person_phone,
    contactPersonAvatar: data.contact_person_avatar,
    notes: data.notes,
  };
  return serializedData;
};

module.exports = { serializeRide, deserializeRide, deserializeData };
