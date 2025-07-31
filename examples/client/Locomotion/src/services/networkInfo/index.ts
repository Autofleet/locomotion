import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import Mixpanel from '../Mixpanel';

class NetworkInfo {
  private isConnected: boolean;

  private isInternetReachable: boolean;

  // eslint-disable-next-line no-use-before-define
  private static instance: NetworkInfo;

  private constructor() {
    this.isConnected = false;
    this.isInternetReachable = false;
    this.fetchData();
    this.addEventListener();
  }

  static getInstance = (): NetworkInfo => {
    if (!this.instance) {
      this.instance = new NetworkInfo();
    }

    return this.instance;
  };

  fetchData = async () => {
    const netInfoData = await NetInfo.fetch();
    this.isConnected = !!netInfoData.isConnected;
    this.isInternetReachable = !!netInfoData.isInternetReachable;
  };

  // eslint-disable-next-line no-unused-vars
  addEventListener = (cb?: (listener: NetInfoState) => void) => NetInfo.addEventListener(
    (listener) => {
      this.isConnected = !!listener.isConnected;
      this.isInternetReachable = !!listener.isInternetReachable;
      Mixpanel.setEvent(`Internet connection changed - is Connected: ${this.isConnected}`);
      if (cb) {
        cb(listener);
      }
    },
  );

  isConnectionAvailable = (): boolean => this.isConnected;
}

export default NetworkInfo.getInstance();
