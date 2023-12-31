import cashIcon from '../../assets/cash.svg';
import offlineIcon from '../../assets/offline.svg';
import personalPaymentIcon from '../../assets/personal-payment.svg';
import businessPaymentIcon from '../../assets/business-payment.svg';

export const PAYMENT_METHODS = {
  CASH: 'cash',
  OFFLINE: 'offline',
  CARD: 'card',
};

export const PAYMENT_TABS = [
  {
    textKey: 'popups.choosePaymentMethod.tabs.personal',
    id: 'personal',
    Svg: personalPaymentIcon,
  },
  {
    textKey: 'popups.choosePaymentMethod.tabs.business',
    id: 'business',
    Svg: businessPaymentIcon,
  },
];
export const INITIAL_ACTIVE_PAYMENT_TAB = PAYMENT_TABS[0].id;
export const paymentMethodToIconMap = {
  [PAYMENT_METHODS.CASH]: cashIcon,
  [PAYMENT_METHODS.OFFLINE]: offlineIcon,
};
