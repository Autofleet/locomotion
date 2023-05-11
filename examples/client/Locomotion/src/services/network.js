import axios from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';
import moment from 'moment';
import uuid from 'react-native-uuid';
import Config from 'react-native-config';
import { getDeviceId } from './device';
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
const getJwtPayload = () => {
  const BYPASS_CAPTCHA_EXPIRY_MINUTES = 60;
  const data = {
    requestId: `${getDeviceId()}:${uuid.v4()}}`,
  };
  const expiry = moment().utc().add(BYPASS_CAPTCHA_EXPIRY_MINUTES, 'minutes').unix();
  return {
    data,
    expiry,
  };
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
        const [baseURL, operationId] = await Promise.all([
          AppSettings.getServerUrl(),
          AppSettings.getOperationId(),
        ]);
        this.axios.defaults.baseURL = baseURL;
        const accessToken = await Auth.getAT(this.axios);
        this.axios.defaults.headers.common.Authorization = accessToken ? `Bearer ${accessToken}` : accessToken;
        if (Config.APP_INTEGRITY_SIGN_KEY) {
          this.axios.defaults.headers.common['app-integrity-token'] = await Auth.jwtSign(getJwtPayload());
        }
        this.axios.defaults.headers.common['x-loco-ds-id'] = operationId;
        this.axios.defaults.headers.common['x-loco-op-id'] = operationId;
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
