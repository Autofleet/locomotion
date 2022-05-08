import moment from 'moment';
import { Ride, User } from '../../models';
import afSdk from '../../sdk';
import SettingsService from '../settings';

require('dotenv');
const logger = require('../../logger');

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

  try {
    const { data: offerResponse } = await afSdk.Rides.createOffer({
      ...offerClone,
      businessModelId: process.env.BUSINESS_MODEL_ID,
      demandSourceId: process.env.DEMAND_SOURCE_ID,
    });

    return {
      ...offerResponse,
      status: offerResponse.state === 'offer-rejected' ? 'rejected' : offerResponse.state,
      pickupTime: offerResponse.stopPoints[0].etaAtMatching,
      dropoffTime: offerResponse.stopPoints[1].etaAtMatching,
    };
  } catch (e) {
    console.error('getting offer error', { e });
    return null;
  }
};

const createRide = async (rideData, userId, operationId) => {
  const [pickup, dropoff] = rideData.stopPoints;
  console.log(operationId, userId);
  const ride = await Ride.create({
    operationId,
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
  } = await User.findByPk(userId, { attributes: ['avatar', 'firstName', 'lastName', 'phoneNumber'] });
  const webhookUrl = `${webHookHost}/api/v1/ride-webhook/${ride.id}`.replace(/([^:]\/)\/+/g, '$1');

  try {
    const stopPoints: Array<any> = [
      {
        type: 'pickup',
        description: ride.pickupAddress,
        lat: ride.pickupLat,
        lng: ride.pickupLng,
        contactPersonName: `${firstName} ${lastName}`,
        contactPersonPhone: phoneNumber,
        contactPersonAvatar: avatar,
        webhookUrl,
      },
      {
        type: 'dropoff',
        lat: ride.dropoffLat,
        lng: ride.dropoffLng,
        description: ride.dropoffAddress,
        contactPersonName: `${firstName} ${lastName}`,
        contactPersonPhone: phoneNumber,
        contactPersonAvatar: avatar,
        webhookUrl,
      }];

    if (rideData.scheduledTo) {
      const windowSetting = await SettingsService.getSettingByKeyFromDb('BEFORE_TIME_WINDOW_MINUTES');
      stopPoints[0].afterTime = rideData.scheduledTo;
      stopPoints[0].beforeTime = moment(rideData.scheduledTo).add(windowSetting.value, 'minutes').format();
    }

    const { data: afRide } = await afSdk.Rides.create({
      rideType: 'passenger',
      externalId: ride.id,
      offerId: rideData.offerId,
      businessModelId: process.env.BUSINESS_MODEL_ID,
      demandSourceId: process.env.DEMAND_SOURCE_ID,
      webhookUrl: `${webHookHost}/api/v1/ride-webhook/${ride.id}`.replace(/([^:]\/)\/+/g, '$1'),
      pooling: rideData.rideType === 'pool' ? 'active' : 'no',
      numberOfPassengers: rideData.numberOfPassengers,
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
  createOffer: async (rideData) => createOffer(rideData),
  create: async (rideData, userId, operationId) => createRide(rideData, userId, operationId),
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
      await afSdk.Rides.cancel(afRide.id, {
        cancellationReason: 'user/cancellation',
        canceledBy: 'locomotion',
      });
      ride.state = 'canceled';
      await ride.save();
      return afRide;
    }

    return null;
  },
  getRideFromAf: async (rideId) => {
    const { data: afRides } = await afSdk.Rides.list({
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
      await afSdk.Rides.rating(afRide.id, {
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
      const afRides: Array<any> = await Promise.all(rides.map(async (ride) => {
        const afRide = await rideService.getRideFromAf(ride.id);
        return afRide;
      }));

      const filteredRides = afRides.filter((ride) => ride && ride.state === 'pending');

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
      await afSdk.Rides.cancel(afRide.id, {
        cancellationReason: 'user/cancellation',
        canceledBy: 'locomotion',
      });

      ride.state = 'canceled';
      await ride.save();
      return afRide;
    }

    return null;
  },
};

export default rideService;
