import axios from 'axios';
import Config from 'react-native-config';
import crashlytics from '@react-native-firebase/crashlytics';
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

const limit = 512;

const formatResponseLog = function ({ data = '' }) {
  let str = (typeof data === 'string' ? data : JSON.stringify(data)).slice(0, limit);
  if (str.length === limit) {
    str = `${str}...(cut)`;
  }
  return str;
};

class Network {
  static defaultSettings = {
    baseURL: '/',
    timeout: 2500,
  };

  constructor(settings = {}) {
    this.settings = Object.assign(Network.defaultSettings, settings);
    this.axios = axios.create(settings);
    this.axios.interceptors.request.use((request) => {
      try {
        // Mixpanel.setEvent('Network request', { method: request.method, endpoint: request.url, params: request.params });
        console.debug(`Request [${request.method}] ${request.url}`);
      } catch (e) {
        console.error('Error in interceptors->request log', e);
      }
      return request;
    });

    this.axios.interceptors.response.use((response) => {
      try {
        // Mixpanel.setEvent('Network response', { method: response.config.method, endpoint: response.config.url, statusCode: response.status });
        console.debug(`Response [${response.config.method}] ${response.config.url}:`, formatResponseLog(response));
      } catch (e) {
        console.error('Error in interceptors->response log', e);
      }
      return response;
    }, (error) => {
      try {
        console.error(`Request rejected [${error.config.method}] ${error.config.url}: ${error}`, formatResponseLog(error.response));
      } catch (e) {
        console.error('Error in interceptors->error log', e, error);
      }
      return Promise.reject(error);
    });

    // Temp
    HTTPMethods.map((method) => {
      this[method] = async (...args) => {
        const baseURL = await AppSettings.getServerUrl();
        this.axios.defaults.baseURL = baseURL;
        const accessToken = await Auth.getAT(this.axios);
        this.axios.defaults.headers.common.Authorization = accessToken ? `Bearer ${accessToken}` : accessToken;

        this.axios.defaults.headers.common['x-loco-ds-id'] = Config.OPERATION_ID;
        this.axios.defaults.headers.common['x-loco-op-id'] = Config.OPERATION_ID;
        return this.axios[method](...args).catch((e) => {
          crashlytics().log(`HTTP Request Error ${e.message}`);
          if ((e.response && e.response.status === 401)
          || (e.response && e.response.status === 403)) {
            console.log('Got unauthorized response move to logout flow');
            Auth.logout();
            return null;
          }
          throw e;
        });
      };
      return true;
    });
  }
}

export default new Network();
