import axios from 'axios';
import logger from '../logger';
import { RideApi } from './RideApi';
import { PaymentApi } from './PaymentApi';

const { AF_API_URL = 'https://api.autofleet.io/' } = process.env;

const refreshAuth = async (network, refreshToken) => {
  const { data: { token } } = await network.post('https://api.autofleet.io/api/v1/login/refresh', {
    refreshToken,
  });
  return token;
};

class AutofleetSdk {
  network: any;

  refreshToken: string;

  token: string;

  Rides: any;

  timeout: ReturnType<typeof setTimeout>;

  Payments: any;

  static async Init({ refreshToken }) {
    const api = new AutofleetSdk({ refreshToken });
    return api;
  }

  constructor({ refreshToken = null } = {}) {
    this.refreshToken = refreshToken;
    this.network = axios.create({
      baseURL: AF_API_URL,
    });

    this.network.interceptors.request.use((config) => {
      if (this.token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
    this.init();
    this.Rides = new RideApi(this.network);
    this.Payments = new PaymentApi(this.network);
  }

  private async init() {
    logger.info('initAuth');
    try {
      this.token = await refreshAuth(this.network, this.refreshToken);
    } catch (e) {
      logger.error(`auth error: ${e}`);
    }
  }
}

// const test = async () => {
//   const sdk = await AutofleetSdk.Init();
//   const { data: rides } = await sdk.Rides.list();
//   logger.info(rides);
// };
// test();

export default AutofleetSdk;
