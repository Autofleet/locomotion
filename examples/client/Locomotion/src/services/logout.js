import Auth from './auth';
import network from './network';

export const logoutUser = async () => {
  const { data } = await network.post('api/v1/me/logout');
  return data;
};

export const logout = async (navigation = null) => {
  try {
    await logoutUser();
    await Auth.logout();
  } catch (e) {
    console.error('error when try to logout', e);
  }
};
