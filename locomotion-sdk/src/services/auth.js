import jwtDecode from 'jwt-decode';
import StorageService from './storage';
import AppSettings from './app-settings';
import { NAVIGATION_CONTAINERS } from '../pages/routes';

class Auth {
  static jwtVerify(token) {
    const decoded = jwtDecode(token);
    const now = (new Date().getTime()) / 1000;
    return decoded.exp && decoded.exp > now;
  }

  loginRefresh = async (network, body) => network.post('api/v1/login/refresh', body)

  getAT = async (network) => {
    const { accessToken, refreshToken } = await StorageService.get(['accessToken', 'refreshToken']);
    if (!refreshToken) {
      return '';
    }

    if (!accessToken || !Auth.jwtVerify(accessToken)) {
      // call server
      let response;
      try {
        response = await this.loginRefresh(network, { refreshToken });
      } catch (error) {
        console.log('error when try to refresh the login token', error);
        if (this.onFaildAuthCallback) { this.onFaildAuthCallback(); }
        return false;
      }

      if (response.data && response.data.accessToken) {
        if (this.onAuthRefreshCallback) {
          this.onAuthRefreshCallback();
        }
        this.updateTokens(refreshToken, response.data.accessToken);
        return response.data.accessToken;
      }
    }
    return accessToken;
  }

  logout = async (navigation) => {
    // TODO: call server on logout
    // try {
    //   await network.post('api/v1/me/logout')
    // } catch (e) {
    //   console.log('Bad logout request', e)
    // }
    await AppSettings.destroy();
    return navigation.replace(NAVIGATION_CONTAINERS.AUTH_SCREENS, { screen: 'Login' });
  }

  onFaildAuth(cb) {
    this.onFaildAuthCallback = cb;
  }

  onAuthRefresh(cb) {
    this.onAuthRefreshCallback = cb;
  }

  updateTokens = (rt, at) => StorageService.save({
    accessToken: at,
    refreshToken: rt,
  })
}

export default new Auth();
