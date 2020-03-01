import network from './network';

const RideHitory = {
  getHistory: async () => {
    const { data: res } = await network.get('api/v1/me/rides');
    return res || {};
  },
};

module.exports = RideHitory;
