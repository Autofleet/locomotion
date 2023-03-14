import { Linking, Dimensions, PixelRatio } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { getCurrentVersion } from './VersionCheck.ts';

export { getDeviceId, getVersion } from 'react-native-device-info';

export default class DeviceService {
  static call(number) {
    const myNumber = `tel:${number}`;
    DeviceService.safeLink(myNumber);
  }

  static sms(number, body = '') {
    const myNumber = `sms:${number}?&body=${body}`;
    DeviceService.safeLink(myNumber);
  }

  static safeLink(link) {
    Linking.canOpenURL(link).then((supported) => {
      if (!supported) {
        console.error(`Can't handle url: ${link}`);
      } else {
        DeviceService.link(link);
      }
    }).catch(err => console.error('An error', err));
  }

  static async canOpenLink(link) {
    const canOpen = await Linking.canOpenURL(link);
    return canOpen;
  }

  static link(link) {
    return Linking.openURL(link);
  }

  static widthPercentageToDP = (widthPercent) => {
    const screenWidth = Dimensions.get('window').width;
    const elemWidth = parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
  };

  static heightPercentageToDP = (heightPercent) => {
    const screenHeight = Dimensions.get('window').height;
    const elemHeight = parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
  };

  static isTablet = () => DeviceInfo.isTablet();

  static getVersion() {
    return getCurrentVersion();
  }
}
