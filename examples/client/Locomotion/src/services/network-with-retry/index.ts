/* eslint-disable no-return-await */
import { AxiosResponse } from 'axios';
import NetworkInfo from '../networkInfo';

interface NetworkWithRetryOptions {
    maxRetries: number;
    intervalInMilliseconds: number;
    retries: number;
}

const defaultOptions: NetworkWithRetryOptions = {
  maxRetries: -1,
  intervalInMilliseconds: 5000,
  retries: 0,
};

class NetworkWithRetry {
  static networkWithRetry = async (
    cb: () => Promise<AxiosResponse<any, any>>,
    options: NetworkWithRetryOptions = defaultOptions,
  ): Promise<any> => {
    const {
      maxRetries,
      intervalInMilliseconds,
      retries,
    } = options;
    if (NetworkInfo.isConnectionAvailable()) {
      return cb();
    }

    await new Promise(resolve => setTimeout(resolve, intervalInMilliseconds));

    if (maxRetries === -1) {
      return this.networkWithRetry(cb, {
        maxRetries,
        intervalInMilliseconds,
        retries: retries + 1,
      });
    }
    if (retries <= maxRetries) {
      return this.networkWithRetry(cb, {
        maxRetries,
        intervalInMilliseconds,
        retries: retries + 1,
      });
    }

    return false;
  };
}

export default NetworkWithRetry;
