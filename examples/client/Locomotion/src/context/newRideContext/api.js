import network from '../../services/network';

export const createServiceEstimations = async (stopPoints) => {
  try {
    const { data } = await network.post('api/v1/services/service-estimations', { stopPoints });
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getServices = async () => {
  try {
    const { data } = await network.get('api/v1/services');
    return data;
  } catch (e) {
    console.log(e);
  }
};
