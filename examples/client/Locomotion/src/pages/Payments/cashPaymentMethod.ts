import { PaymentMethodInterface } from '../../context/payments/interface';

const cashPaymentMethod : PaymentMethodInterface = {
  brand: 'generic',
  createdAt: new Date(),
  customerId: '',
  expiresAt: new Date(2100, 9, 9),
  hasOutstandingBalance: false,
  id: 'cash',
  isDefault: false,
  isExpired: false,
  lastFour: '',
  name: 'Pay with cash',
  stripeId: '',
  updatedAt: new Date(),
  deletedAt: null,
};

export default cashPaymentMethod;
