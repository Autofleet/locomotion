import axios from 'axios';

const AUTHORIZATION_HEADER = 'Authorization';

const HTTPMethods = [
  'get',
  'post',
  'delete',
  'head',
  'put',
  'patch',
  'options',
];

const authCode = `${localStorage.token}`;
class Network {
  static defaultSettings = {
    baseURL: '/',
    timeout: 2500,
  }

  constructor(settings = {}) {
    this.settings = Object.assign(Network.defaultSettings, settings);
    this.axios = axios.create(settings);
    this.axios.defaults.headers.common[AUTHORIZATION_HEADER] = `Bearer ${authCode}`;

    HTTPMethods.map((method) => {
      this[method] = async (...args) => this.axios[method](...args).catch((error) => {
        if (error.response.status === 403 && localStorage.token) {
          localStorage.removeItem('token')
          window.location.reload();
        }
        throw error;
      });
      return true;
    });
  }

  setToken = (token) => {
    this.axios.defaults.headers.common[AUTHORIZATION_HEADER] = `Bearer ${token}`;
  };
}

export default new Network({ baseURL: '/' });
