import MccMncList from 'mcc-mnc-list';
import CarrierInfo from 'react-native-carrier-info';
import Config from 'react-native-config';

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
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data?.country;
  } catch (error) {
    console.error('Unable to get country code by IP', error);
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
    return IsoByMncMcc || mobileIso || await getCountryCodeByIP() || defaultCountryCode;
  } catch (error) {
    console.error('cannot get iso code', error);
    return await getCountryCodeByIP() || defaultCountryCode;
  }
};
