require('dotenv');
const logger = require('../../logger');
const { Ride, User } = require('../../models');
const afSdk = require('../../sdk');
const sdk = require('../../sdk');

const webHookHost = process.env.SERVER_HOST || 'https://716ee2e6.ngrok.io';


const createOffer = async (rideData) => {
  let pooling;
  if (process.env.POOLING) {
    pooling = process.env.POOLING;
  } else {
    pooling = rideData.rideType === 'pool' ? 'active' : 'no';
  }
  const offerClone = {
    rideType: 'passenger',
    pooling,
    stopPoints: [
      {
        type: 'pickup',
        lat: parseFloat(rideData.pickupLat),
        lng: parseFloat(rideData.pickupLng),
        webhookUrl: null,
      },
      {
        type: 'dropoff',
        lat: parseFloat(rideData.dropoffLat),
        lng: parseFloat(rideData.dropoffLng),
        webhookUrl: null,
      },
    ],
    numberOfPassengers: rideData.numberOfPassengers,
  };

  const { data: offerResponse } = await sdk.Rides.createOffer({
    ...offerClone,
    businessModelId: process.env.BUSINESS_MODEL_ID,
    demandSourceId: process.env.DEMAND_SOURCE_ID,
  });

  console.log('offer', { offerClone, offerResponse });

  return {
    ...offerResponse,
    status: offerResponse.state === 'offer-rejected' ? 'rejected' : offerResponse.state,
    pickupTime: offerResponse.stopPoints[0].etaAtMatching,
    dropoffTime: offerResponse.stopPoints[1].etaAtMatching,
  };
};

const createRide = async (rideData, userId) => {
  const [pickup, dropoff] = rideData.stopPoints;

  const ride = await Ride.create({
    ...rideData,
    numberOfPassenger: rideData.numberOfPassengers,
    userId,
    pickupLat: pickup.lat,
    pickupLng: pickup.lng,
    pickupAddress: pickup.address,
    dropoffLat: dropoff.lat,
    dropoffLng: dropoff.lng,
    dropoffAddress: dropoff.address,
  });

  const {
    avatar, firstName, lastName, phoneNumber,
  } = await User.findById(userId, { attributes: ['avatar', 'firstName', 'lastName', 'phoneNumber'] });
  const webhookUrl = `${webHookHost}/api/v1/ride-webhook/${ride.id}`.replace(/([^:]\/)\/+/g, '$1');

  try {
    const stopPoints = [
      {
        type: 'pickup',
        description: ride.pickupAddress,
        lat: parseFloat(ride.pickupLat),
        lng: parseFloat(ride.pickupLng),
        contactPersonName: `${firstName} ${lastName}`,
        contactPersonPhone: phoneNumber,
        contactPersonAvatar: avatar,
        webhookUrl,
      },
      {
        type: 'dropoff',
        lat: parseFloat(ride.dropoffLat),
        lng: parseFloat(ride.dropoffLng),
        description: ride.dropoffAddress,
        contactPersonName: `${firstName} ${lastName}`,
        contactPersonPhone: phoneNumber,
        contactPersonAvatar: avatar,
        webhookUrl,
      }];

    if (rideData.scheduledTo) {
      stopPoints[0].afterTime = rideData.scheduledTo;
    }

    const { data: afRide } = await afSdk.Rides.create({
      rideType: 'passenger',
      externalId: ride.id,
      offerId: rideData.offerId,
      businessModelId: process.env.BUSINESS_MODEL_ID,
      demandSourceId: process.env.DEMAND_SOURCE_ID,
      webhookUrl: `${webHookHost}/api/v1/ride-webhook/${ride.id}`.replace(/([^:]\/)\/+/g, '$1'),
      pooling: rideData.rideType === 'pool' ? 'active' : 'no',
      numberOfPassengers: ride.numberOfPassengers,
      stopPoints,
    });

    if (afRide.state === 'rejected') {
      ride.state = 'rejected';
    } else if (afRide.state === 'pending') {
      ride.state = 'pending';
    } else {
      ride.state = 'active';
    }
  } catch (e) {
    console.log(e.response.data);
    logger.error(e.stack || e);
    ride.state = 'rejected';
  }

  await ride.save();
  return ride;
};

const rideService = {
  createOffer: async rideData => createOffer(rideData),
  create: async (rideData, userId) => createRide(rideData, userId),
  getRidderActiveRide: async (userId) => {
    const ride = await Ride.findOne({
      where: {
        userId,
        state: 'active',
      },
    });

    if (ride) {
      const afRide = await rideService.getRideFromAf(ride.id);
      return { ...afRide, arrivingPush: ride.arrivingPush };
    }

    return null;
  },
  cancelActiveRide: async (userId) => {
    const ride = await Ride.findOne({
      where: {
        userId,
        state: 'active',
      },
    });

    if (ride) {
      const afRide = await rideService.getRideFromAf(ride.id);
      await sdk.Rides.cancel(afRide.id, {
        cancellationReason: 'user/cancellation',
        cancelledBy: 'locomotion',
      });
      ride.state = 'canceled';
      await ride.save();
      return afRide;
    }

    return null;
  },
  getRideFromAf: async (rideId) => {
    const { data: afRides } = await sdk.Rides.list({
      externalId: rideId,
      demandSourceId: process.env.DEMAND_SOURCE_ID,
    });

    return afRides[0];
  },

  getRideSummary: async (userId, rideId) => {
    const ride = await Ride.findOne({
      where: {
        id: rideId,
        userId,
        state: 'completed',
      },
    });

    if (ride) {
      const afRide = await rideService.getRideFromAf(ride.id);
      return afRide;
    }

    return null;
  },

  updateRideRating: async (userId, rideId, rating) => {
    const ride = await Ride.findOne({
      where: {
        id: rideId,
        userId,
        state: 'completed',
      },
    });

    if (!ride.rating) {
      ride.rating = rating;
      await ride.save();
    }

    if (ride) {
      const afRide = await rideService.getRideFromAf(ride.id);
      await sdk.Rides.rating(afRide.id, {
        demandSourceId: process.env.DEMAND_SOURCE_ID,
        rating,
      });

      return ride;
    }

    return null;
  },

  getPendingRides: async (userId) => {
    const rides = await Ride.findAll({
      where: {
        userId,
        state: 'pending',
      },
    });

    if (rides) {
      const afRides = await Promise.all(rides.map(async (ride) => {
        const afRide = await rideService.getRideFromAf(ride.id);
        return afRide;
      }));

      const filteredRides = afRides.filter(ride => ride && ride.state === 'pending');

      return filteredRides;
    }

    return null;
  },

  cancelFutureRide: async (userId, rideId) => {
    const ride = await Ride.findOne({
      where: {
        id: rideId,
        userId,
        state: 'pending',
      },
    });

    if (ride) {
      const afRide = await rideService.getRideFromAf(ride.id);
      await sdk.Rides.cancel(afRide.id, {
        cancellationReason: 'user/cancellation',
        cancelledBy: 'locomotion',
      });

      ride.state = 'canceled';
      await ride.save();
      return afRide;
    }

    return null;
  },
};

module.exports = rideService;
