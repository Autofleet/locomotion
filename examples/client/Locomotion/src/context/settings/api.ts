import NetworkWithRetry from '../../services/network-with-retry';
import network from '../../services/network';

export const getByKey = async (key: string) => {
  const { data } = await network.get(`/api/v1/settings/${key}`);
  return data;
};

export const getMultipleByKeys = async (keys: string[]) => {
  const { data } = await network.get('/api/v1/settings/', {
    params: {
      keys,
    },
  });
  return data;
};

export const getAppSettings = async () => {
  const { data } = await NetworkWithRetry.networkWithRetry(() => network.get('/api/v1/app-settings'));
  return data;
};

export const getWorkingHoursData = async () => {
  const { data } = await network.get('/api/v1/me/app-settings/working-hours');
  return data;
};
