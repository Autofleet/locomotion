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

const getIsoCodeByList = (mccMnc, mobileIso) => {
  const result = MccMncList.filter({ mccmnc: mccMnc });
  if (result.length > 1) {
    const accurateResult = result.find((r) => r.countryCode === (mobileIso || defaultCountryCode));
    return accurateResult?.countryCode;
  }
  return result && result[0]?.countryCode;
};

const withTimeout = (promise, ms) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

export const getInputIsoCode = async () => {
  try {
    const [mmcMnc, mobileIso] = await Promise.all([
      withTimeout(getMccMnc(), 3000),
      withTimeout(getMobileIsoCode(), 3000),
    ]);

    const IsoByMncMcc = mmcMnc ? getIsoCodeByList(mmcMnc, mobileIso) : null;
    return IsoByMncMcc || mobileIso || defaultCountryCode;
  } catch (error) {
    console.error('cannot get iso code', error);
    return defaultCountryCode;
  }
};
