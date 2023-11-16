import { isCardPaymentMethod } from '../../lib/ride/utils';
import { PAYMENT_METHODS } from '../../lib/commonTypes';

export const capitalizeFirstLetter = (string: string) => string?.charAt(0).toUpperCase() + string?.slice(1);
export const getLastFourForamttedShort = (lastFour: string) => `**** ${capitalizeFirstLetter(lastFour)}`;
export const getLastFourForamttedLong = (lastFour: string) => `**** **** **** ${capitalizeFirstLetter(lastFour)}`;

export const getPaymentMethod = (paymentMethodId: string) => {
  if (!isCardPaymentMethod({ id: paymentMethodId })) {
    return paymentMethodId;
  }
  return PAYMENT_METHODS.CARD;
};
