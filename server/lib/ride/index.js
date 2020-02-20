require('dotenv');
const axios = require('axios');
const { Ride, User } = require('../../models');

const demandApi = axios.create({
  baseURL: process.env.AF_BACKEND_URL || 'https://demand.autofleet.io/',
  headers: { Authorization: process.env.AF_API_TOKEN },
});

const webHookHost = process.env.SERVER_HOST || 'https://716ee2e6.ngrok.io';

const rideService = {
  create: async (rideData, userId) => {
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

      if (afRide.status === 'rejected') {
        ride.state = 'rejected';
      } else {
        ride.state = 'active';
      }
    } catch (e) {
      ride.state = 'rejected';
    }

    await ride.save();
    return ride;
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
