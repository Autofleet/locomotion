require('dotenv');
const axios = require('axios');
const logger = require('../../logger');
const { Ride, User } = require('../../models');

const demandApi = axios.create({
  baseURL: process.env.AF_BACKEND_URL || 'https://demand.autofleet.io/',
  headers: { Authorization: process.env.AF_API_TOKEN },
});

const webHookHost = process.env.SERVER_HOST || 'https://716ee2e6.ngrok.io';

const createOffer = async ({external_id, demand_source_id, businessModelId, stop_points}) => {
  const { data: newOffer } = await demandApi.post('/api/v1/offers', {
      type: 'offer',
      externalId: external_id,
      demandSourceId: demand_source_id,
      businessModelId,
      offer_stop_points: stop_points
    });
  return newOffer.status === 'rejected' ? null : newOffer;
};

const rideService = {
  createOffer,
  create: async (rideData, userId) => {
    let offer = null;
    const ride = await Ride.create({
      ...rideData,
      userId,
    });

    const {
      avatar, firstName, lastName, phoneNumber,
    } = await User.findById(userId, { attributes: ['avatar', 'firstName', 'lastName', 'phoneNumber'] });

    try {
      const { data: afRide } = await demandApi.post('/api/v1/rides', {
        external_id: ride.id,
        offer_id: rideData.offerId,
        webhook_url: `${webHookHost}/api/v1/ride-webhook/${ride.id}`.replace(/([^:]\/)\/+/g, '$1'),
        pooling: rideData.rideType === 'pool' ? 'active' : 'no',
        number_of_passengers: ride.numberOfPassenger,
        stop_points: [
          {
            type: 'pickup',
            lat: parseFloat(rideData.pickupLat),
            lng: parseFloat(rideData.pickupLng),
            description: ride.pickupAddress,
            contact_person: `${firstName} ${lastName}`,
            contact_person_phone: phoneNumber,
            contact_person_avatar: avatar,
          },
          {
            type: 'dropoff',
            lat: parseFloat(rideData.dropoffLat),
            lng: parseFloat(rideData.dropoffLng),
            description: ride.dropoffAddress,
            contact_person: `${firstName} ${lastName}`,
            contact_person_phone: phoneNumber,
            contact_person_avatar: avatar,
          },
        ],
      });

      if (afRide.status !== 'rejected') {
        ride.state = 'active';
      } else {
        ride.state = 'rejected';
        offer = await createOffer(afRide);
      }
    } catch (e) {
      ride.state = 'rejected';
    }

    await ride.save();
    return { ride, offer };
  },
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
    const { data: afRides } = await demandApi.get('/api/v1/rides', { params: { externalId: rideId } });
    return afRides[0];
  },
};

module.exports = rideService;
