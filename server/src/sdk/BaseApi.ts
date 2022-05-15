import { AxiosInstance } from 'axios';

export default class BaseApi {
  network: AxiosInstance;

  constructor(network) {
    this.network = network;
  }
}
