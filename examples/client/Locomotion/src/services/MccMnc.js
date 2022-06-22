import MccMncList from 'mcc-mnc-list';
import CarrierInfo from 'react-native-carrier-info';

const defaultCountryCode = 'IL';
const getMccMnc = async () => {
  const mccMnc = await CarrierInfo.mobileNetworkOperator();
  return mccMnc;
};

const getMobileIsoCode = async () => {
  const isoCode = await CarrierInfo.isoCountryCode();
  return isoCode.toUpperCase();
};

const getIsoCodeByList = (mccMnc) => {
  const result = MccMncList.filter({ mccmnc: mccMnc });
  return result && result[0]?.countryCode;
};

export const getInputIsoCode = async () => {
  try {
    const [mmcMnc, mobileIso] = await Promise.all([
      getMccMnc(),
      getMobileIsoCode(),
    ]);

    const IsoByMncMcc = mmcMnc ? getIsoCodeByList(mmcMnc) : null;
    return IsoByMncMcc || mobileIso || defaultCountryCode;
  } catch (error) {
    console.error('cannot get iso code', error);
    return defaultCountryCode;
  }
};
