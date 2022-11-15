/* eslint-disable class-methods-use-this */
import jwtDecode from 'jwt-decode';
import RNRestart from 'react-native-restart';
import StorageService from './storage';
import AppSettings from './app-settings';
import { logoutUser } from '../context/user/api';

class Auth {
  static jwtVerify(token) {
    const decoded = jwtDecode(token);
    const now = (new Date().getTime()) / 1000;
    return decoded.exp && decoded.exp > now;
  }

  loginRefresh = async (network, body) => network.post('api/v1/login/refresh', body, {
    headers: {
      Authorization: '',
    },
  });

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
        this.logout();
        return false;
      }

      if (response.data && response.data.accessToken) {
        if (this.onAuthRefreshCallback) {
          this.onAuthRefreshCallback();
        }
        await this.updateTokens(response.data.refreshToken, response.data.accessToken);
        return response.data.accessToken;
      }
      this.logout();
      return false;
    }
    return accessToken;
  };

  logout = async () => {
    await logoutUser();
    await AppSettings.destroy();
    RNRestart.Restart();
  };

  onFaildAuth(cb) {
    this.onFaildAuthCallback = cb;
  }

  onAuthRefresh(cb) {
    this.onAuthRefreshCallback = cb;
  }

  updateTokens = (rt, at) => StorageService.save({
    accessToken: at,
    refreshToken: rt,
  });
}

export default new Auth();
