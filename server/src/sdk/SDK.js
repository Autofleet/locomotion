const axios = require('axios');
const jwt = require('jsonwebtoken');

const { AF_API_URL = 'https://api.autofleet.io/' } = process.env;
const refreshUrl = '/api/v1/login/refresh';

class BaseApi {
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

class AutofleetSdk {
  static async Init({ refreshToken }) {
    const api = new AutofleetSdk({ refreshToken });
    await api.refreshTokenAndSetInterval();
    return api;
  }

  constructor({ refreshToken } = {}) {
    this.refreshToken = refreshToken;
    this.network = axios.create({
      baseURL: AF_API_URL,
    });

    this.refreshTokenAndSetInterval();
    this.network.interceptors.request.use((config) => {
      if (this.token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
    this.Rides = new RideApi(this.network);
  }

  async refreshTokenAndSetInterval() {
    return;
    clearTimeout(this.timeout);
    const response = await this.network.post(refreshUrl, {
      refreshToken: this.refreshToken,
    });
    const tokenPayload = jwt.decode(response.data.token);
    this.token = response.data.token;
    const expiryDate = new Date(tokenPayload.exp * 1000);
    const msUntilNextExpiry = expiryDate.getTime() - (new Date()).getTime();
    this.timeout = setTimeout(() => {
      // this.refreshTokenAndSetInterval();
    }, msUntilNextExpiry - (3 * 1000));
  }
}

// const test = async () => {
//   const sdk = await AutofleetSdk.Init();
//   const { data: rides } = await sdk.Rides.list();
//   console.log(rides);
// };
// test();

module.exports = AutofleetSdk;
