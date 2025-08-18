import cashIcon from '../../assets/cash.svg';
import offlineIcon from '../../assets/offline.svg';
import  defaultPaymentIcon from '../../assets/default-payment.svg';
import personalPaymentIcon from '../../assets/personal-payment.svg';
import businessPaymentIcon from '../../assets/business-payment.svg';

export const PAYMENT_METHODS = {
  CASH: 'cash',
  OFFLINE: 'offline',
  CARD: 'card',
  EXTERNAL: 'external',
};
export const PAYMENT_MODES = {
  PERSONAL: 'personal',
  BUSINESS: 'business',
};
export const PAYMENT_TABS = [
  {
    textKey: 'popups.choosePaymentMethod.tabs.personal',
    id: PAYMENT_MODES.PERSONAL,
    Svg: personalPaymentIcon,
  },
  {
    textKey: 'popups.choosePaymentMethod.tabs.business',
    id: PAYMENT_MODES.BUSINESS,
    Svg: businessPaymentIcon,
  },
];
export const paymentMethodToIconMap = {
  [PAYMENT_METHODS.CASH]: cashIcon,
  [PAYMENT_METHODS.OFFLINE]: offlineIcon,
  [PAYMENT_METHODS.EXTERNAL]: defaultPaymentIcon,
};
