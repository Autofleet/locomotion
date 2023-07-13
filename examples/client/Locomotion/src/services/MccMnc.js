import MccMncList from 'mcc-mnc-list';
import CarrierInfo from 'react-native-carrier-info';
import Config from 'react-native-config';
import mixpanel from 'services/Mixpanel';
import {getCountry} from 'react-native-localize';

const IP_LOCATION_API = Config.IP_LOCATION_API || 'https://ipapi.co/json/';

const defaultCountryCode = Config.DEFAULT_COUNTRY_CODE;
const getMccMnc = async () => {
  const mccMnc = await CarrierInfo.mobileNetworkOperator();
  return mccMnc;
};

const getMobileIsoCode = async () => {
  const isoCode = await CarrierInfo.isoCountryCode();
  return isoCode.toUpperCase();
};
export const getCountryCodeByIP = async () => {
  try {
    const response = await fetch(IP_LOCATION_API);
    const data = await response.json();
    return data?.country;
  } catch (error) {
    mixpanel.trackWithProperties('Unable to get country code by IP', { error });
    return null;
  }
};

const getIsoCodeByList = (mccMnc, mobileIso) => {
  const result = MccMncList.filter({ mccmnc: mccMnc });
  if (result.length > 1) {
    const accurateResult = result.find(r => r.countryCode === (mobileIso || defaultCountryCode));
    return accurateResult?.countryCode;
  }
  return result && result[0]?.countryCode;
};

export const getInputIsoCode = async () => {
  try {
    const [mmcMnc, mobileIso] = await Promise.all([
      getMccMnc(),
      getMobileIsoCode(),
    ]);

    const IsoByMncMcc = mmcMnc ? getIsoCodeByList(mmcMnc, mobileIso) : null;
    return IsoByMncMcc || mobileIso || getCountry() || await getCountryCodeByIP() || defaultCountryCode;
  } catch (error) {
    mixpanel.trackWithProperties('Unable to get input iso code from sim', { error });
    return await getCountryCodeByIP() || defaultCountryCode;
  }
};
