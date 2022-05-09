/* eslint-disable max-classes-per-file */
const axios = require('axios');

const { AF_API_URL = 'https://api.autofleet.io/' } = process.env;

class BaseApi {
  network: any;

  constructor(network) {
    this.network = network;
  }
}

class RideApi extends BaseApi {
  list(query) {
    return this.network.get('/api/v1/rides', { params: query });
  }

  get(id) {
    return this.network.get(`/api/v1/rides/${id}`);
  }

  create(payload) {
    return this.network.post('/api/v1/rides/', payload);
  }

  createOffer(payload) {
    return this.network.post('/api/v1/offers', payload);
  }

  cancel(id, options) {
    return this.network.put(`/api/v1/rides/${id}/cancel`, options);
  }

  rating(id, options) {
    return this.network.put(`/api/v1/rides/${id}`, options);
  }
}

class PaymentApi extends BaseApi {
  async getCustomer(id) {
    return this.network.get(`/api/v1/customer/${id}`, {
      params: {
        businessModelId: process.env.BUSINESS_MODEL_ID,
      },
    });
  }

  createCustomer(payload) {
    return this.network.post('/api/v1/customer', payload);
  }

  createPaymentIntent(payload) {
    return this.network.post('/api/v1/payment/setup', payload);
  }

  listMethods(userId) {
    return this.network.get('/api/v1/payment/methods', {
      params: {
        businessModelId: process.env.BUSINESS_MODEL_ID,
        userId,
      },
    });
  }

  detachPaymentMethod(payload) {
    return this.network.post('/api/v1/payment/methods/detach', payload);
  }
}

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
