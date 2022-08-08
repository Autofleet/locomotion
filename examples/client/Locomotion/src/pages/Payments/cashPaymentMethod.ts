import i18n from '../../I18n';
import { PaymentMethodInterface } from '../../context/payments/interface';

export const CASH_KEY = i18n.t('payments.cash');
const cashPaymentMethod : PaymentMethodInterface = {
  brand: 'generic',
  createdAt: new Date(),
  customerId: '',
  expiresAt: new Date(2100, 9, 9),
  hasOutstandingBalance: false,
  id: CASH_KEY,
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
