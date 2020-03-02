import network from './network';

const RideHitory = {
  getHistory: async () => {
    const req = await network.get('api/v1/me/rides/history');
    const { data: res } = req;
    return res || {};
  },
};

module.exports = RideHitory;
