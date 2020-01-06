import axios from 'axios';
import qs from 'qs';
import Auth from './auth';
import AppSettings from './app-settings';

const HTTPMethods = [
  'get',
  'post',
  'delete',
  'head',
  'put',
  'patch',
  'options',
];

class Network {
  static defaultSettings = {
    baseURL: '/',
    timeout: 2500,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' }),
  }

  constructor(settings = {}) {
    this.settings = Object.assign(Network.defaultSettings, settings);
    this.axios = axios.create(this.settings);
    this.axios.interceptors.request.use((request) => {
      console.log(`Starting Request [${request.method}] ${request.url}`, request);
      return request;
    });

    this.axios.interceptors.response.use((response) => {
      console.log(`Response [${response.config.method}] ${response.config.url}:`, response);
      return response;
    });

    // Temp
    HTTPMethods.map((method) => {
      this[method] = async (...args) => {
        const baseURL = await AppSettings.getServerUrl();
        this.axios.defaults.baseURL = baseURL;
        const accessToken = await Auth.getAT(this.axios);
        this.axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        return this.axios[method](...args).catch((e) => {
          if ((e.response && e.response.status === 401) || (e.response && e.response.status === 403)) {
            console.log('Got unauthorized response move to logout flow')
            Auth.logout();
            return;
          }
        });
      };
      return true;
    });
  }
}

export default new Network();
