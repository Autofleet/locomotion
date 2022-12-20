import i18n from '../../I18n';
import { PaymentMethodInterface } from '../../context/payments/interface';
import { PAYMENT_METHODS } from './consts';

const cashPaymentMethod : PaymentMethodInterface = {
  brand: 'generic',
  createdAt: new Date(),
  customerId: '',
  expiresAt: new Date(2100, 9, 9),
  hasOutstandingBalance: false,
  id: PAYMENT_METHODS.CASH,
  isDefault: false,
  isExpired: false,
  lastFour: '',
  name: i18n.t('payments.payWithCash'),
  stripeId: '',
  updatedAt: new Date(),
  deletedAt: null,
  outstandingBalance: { amount: 0, currency: 'USD' },
};

export default cashPaymentMethod;
