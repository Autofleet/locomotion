import axios, { AxiosInstance } from 'axios';
import logger from '../logger';
import RideApi from './RideApi';
import PaymentApi from './PaymentApi';

const { AF_API_URL = 'https://api.autofleet.io/', DEBUG = false } = process.env;

const refreshAuth = async (network, refreshToken) => {
  const { data: { token } } = await network.post('https://api.autofleet.io/api/v1/login/refresh', {
    refreshToken,
  });
  return token;
};

const limit = 512;

const formatResponseLog = ({ data }) => {
  let str = (typeof data === 'string' ? data : JSON.stringify(data)).slice(0, limit);
  if (str.length === limit) {
    str = `${str}...(cut)`;
  }
  return str;
};

class AutofleetSdk {
  network: AxiosInstance;

  refreshToken: string;

  token: string;

  Rides: RideApi;

  Payments: PaymentApi;

  static async Init({ refreshToken }) {
    const api = new AutofleetSdk({ refreshToken });
    return api;
  }

  constructor({ refreshToken = null } = {}) {
    this.refreshToken = refreshToken;
    this.init();
  }

  private async initAuth() {
    logger.info('initAuth');
    try {
      this.token = await refreshAuth(this.network, this.refreshToken);
    } catch (e) {
      logger.error(`auth error: ${e}`);
    }
  }

  private init() {
    this.network = axios.create({
      baseURL: AF_API_URL,
    });
    this.initAuth();

    this.network.interceptors.request.use((config) => {
      if (this.token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    if (DEBUG) {
      this.network.interceptors.request.use((request) => {
        try {
          console.debug(`Request [${request.method}] ${request.url}`);
        } catch (e) {
          console.error('Error in interceptors->request log', e);
        }
        return request;
      });

      this.network.interceptors.response.use((response) => {
        try {
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
    }

    this.Rides = new RideApi(this.network);
    this.Payments = new PaymentApi(this.network);
  }
}

// const test = async () => {
//   const sdk = await AutofleetSdk.Init();
//   const { data: rides } = await sdk.Rides.list();
//   logger.info(rides);
// };
// test();

export default AutofleetSdk;
