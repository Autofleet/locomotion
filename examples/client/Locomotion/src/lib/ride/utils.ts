import i18n from '../../I18n';
import {
  formatUiDisplaySpType, isMulti,
} from '../commonTypes';
import { PAYMENT_METHODS } from '../../pages/Payments/consts';

export const formatSps = function (stopPoints: any) {
  const orderDesc: any = {};

  const getOrdinalDescForSp = (sp: any) => {
    const val = orderDesc[sp.type] || 0;
    orderDesc[sp.type] = (
      val + 1
    );
    return val;
  };

  return stopPoints
    .sort((sp1: any, sp2: any) => sp1.orderInParent - sp2.orderInParent)
    .map((sp: any) => ({
      ...sp,
      ordinalDesc: getOrdinalDescForSp(sp),
    }))
    .map((sp: any) => ({
      ...sp,
      amountOfSpsFromType: orderDesc[sp.type],
    }));
};


export const getOrdinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const getSpTextWithNumberPrefix = (sp: any) => {
  const uiSpType = formatUiDisplaySpType(sp, null);
  const { ordinalDesc } = sp;
  const isMultiSp = isMulti(sp);
  const isOnlyMultiSp = isMultiSp && sp.amountOfSpsFromType === 2;
  const ordinalNumberPrefixText = `${sp.ordinalDesc && !isOnlyMultiSp ? `${getOrdinal(isMultiSp ? ordinalDesc : ordinalDesc + 1)} ` : ''}`;
  return `${ordinalNumberPrefixText}${i18n.t(`stopPointsTypes.${uiSpType}`)}`;
};

export const isCashPaymentMethod = (paymentMethod: any) => paymentMethod.id === PAYMENT_METHODS.CASH;

export const isCardPaymentMethod = (paymentMethod: any) => ![PAYMENT_METHODS.CASH, PAYMENT_METHODS.OFFLINE].includes(paymentMethod?.id);
