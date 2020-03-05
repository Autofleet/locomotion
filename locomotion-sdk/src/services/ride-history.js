import network from './network';

const RideHitory = {
  getHistory: async () => {
    const { data } = await network.get('api/v1/me/rides/history');
    return data || {};
  },
};

module.exports = RideHitory;
