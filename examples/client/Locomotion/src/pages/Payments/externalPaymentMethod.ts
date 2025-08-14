import { PaymentMethodInterface } from 'context/payments/interface';
import { PAYMENT_METHODS } from './consts';
import i18n from 'i18next';

const externalPaymentMethod : PaymentMethodInterface = {
    brand: 'generic',
    createdAt: new Date(),
    customerId: '',
    expiresAt: new Date(2100, 9, 9),
    hasOutstandingBalance: false,
    id: PAYMENT_METHODS.EXTERNAL,
    isDefault: false,
    isExpired: false,
    lastFour: '',
    name: i18n.t('payments.external'),
    stripeId: '',
    updatedAt: new Date(),
    deletedAt: null,
    outstandingBalance: { amount: 0, currency: 'USD' },
};

export default externalPaymentMethod;
