import cashIcon from '../../assets/cash.svg';
import offlineIcon from '../../assets/offline.svg';

export const PAYMENT_METHODS = {
  CASH: 'cash',
  OFFLINE: 'offline',
  CARD: 'card',
};

export const paymentMethodToIconMap = {
  [PAYMENT_METHODS.CASH]: cashIcon,
  [PAYMENT_METHODS.OFFLINE]: offlineIcon,
};
