import axios from 'axios';

const HTTPMethods = [
  'get',
  'post',
  'delete',
  'head',
  'put',
  'patch',
  'options',
];

const authCode = `Bearer ${localStorage.token}`;
class Network {
  static defaultSettings = {
    baseURL: '/',
    timeout: 2500,
  }

  constructor(settings = {}) {
    this.settings = Object.assign(Network.defaultSettings, settings);
    this.axios = axios.create(settings);
    console.log(authCode);
    this.axios.defaults.headers.common.Authorization = authCode;


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
}

export default new Network({ baseURL: '/' });
