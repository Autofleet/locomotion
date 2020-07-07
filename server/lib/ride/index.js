require('dotenv');
const axios = require('axios');
const logger = require('../../logger');
const { Ride, User } = require('../../models');
const { Op } = require('sequelize');
const serialize = require('./serializers/serializeRide');
const serializeOffer = require('./serializers/serializeOffer');
const { off } = require('../../logger');

const api = axios.create({
  baseURL: process.env.AF_BACKEND_URL || 'https://api.autofleet.io/',
  headers: { Authorization: process.env.AF_API_TOKEN },
});

const demandApi = {};
const webHookHost = process.env.SERVER_HOST || 'https://716ee2e6.ngrok.io';


const createOffer = async (rideData) => {
  const offerClone = serializeOffer.deserializeOffer({
    type: 'offer',
    pooling: process.env.pooling || rideData.rideType === 'pool' ? 'active' : 'no',
    offer_stop_points: [
      {
        type: 'pickup',
        lat: parseFloat(rideData.pickupLat),
        lng: parseFloat(rideData.pickupLng),
      },
      {
        type: 'dropoff',
        lat: parseFloat(rideData.dropoffLat),
        lng: parseFloat(rideData.dropoffLng),
      },
    ],
    number_of_passengers: rideData.numberOfPassengers,
  });

  const { data: offer } = await api.post('/api/v1/offers', {
    ...offerClone,
    businessModelId: 'afe63608-e559-4ed0-a716-a34feca2d1b0',
    demandSourceId: 'aeeff4c0-529d-4325-9283-f6d9ce4db1ab',
  });
  console.log('Offer', offer);

  return offer;
};

const createRide = async (rideData, userId) => {
  const ride = await Ride.create({
    ...rideData,
    numberOfPassenger: rideData.numberOfPassengers,
    userId,
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
    console.log(JSON.stringify({
      externalId: ride.id,
      offerId: rideData.offerId,
      webhookUrl: `${webHookHost}/api/v1/ride-webhook/${ride.id}`.replace(/([^:]\/)\/+/g, '$1'),
      pooling: rideData.rideType === 'pool' ? 'active' : 'no',
      numberOfPassengers: ride.numberOfPassengers,
      stopPoints,
    }));

    const { data: afRide } = await api.post('/api/v1/rides', {
      externalId: ride.id,
      offerId: rideData.offerId,
      webhookUrl: `${webHookHost}/api/v1/ride-webhook/${ride.id}`.replace(/([^:]\/)\/+/g, '$1'),
      pooling: rideData.rideType === 'pool' ? 'active' : 'no',
      numberOfPassengers: ride.numberOfPassengers,
      stopPoints,
    });

    if (afRide.status === 'rejected') {
      ride.state = 'rejected';
    } else if (afRide.status === 'pending') {
      ride.state = 'pending';
    } else {
      ride.state = 'active';
    }
  } catch (e) {
    logger.error(e.stack || e);
    ride.state = 'rejected';
  }

  await ride.save();
  return ride;
};

const rideService = {
  createOffer: async rideData => await createOffer(rideData),
  create: async (rideData, userId) => await createRide(rideData, userId),
  getRidderActiveRide: async (userId) => {
    const ride = await Ride.findOne({
      where: {
        userId,
        state: 'active',
      },
    });

    if (ride) {
      const afRide = await rideService.getRideFromAf(ride.id);
      return afRide;
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
      await demandApi.put(`/api/v1/rides/${afRide.id}/cancel`, {
        cancellation_reason: 'user/cancellation',
      });
      ride.state = 'canceled';
      await ride.save();
      return afRide;
    }

    return null;
  },
  getRideFromAf: async (rideId) => {
    const { data: afRides } = await api.get('/api/v1/rides', { params: { externalId: rideId, demandSourceId: '542e6040-3dc4-44f4-8ea0-efee1c35088b' } });

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
      const updatedRide = await demandApi.post(`/api/v1/rides/${afRide.id}/rating`, {
        rating,
      });
      return updatedRide;
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

      const filteredRides = afRides.filter(ride => ride.state === 'pending');

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
      const resp = await demandApi.put(`/api/v1/rides/${afRide.id}/cancel`, {
        cancellation_reason: 'user/cancellation',
      });

      ride.state = 'canceled';
      await ride.save();
      return afRide;
    }

    return null;
  },
};

module.exports = rideService;
