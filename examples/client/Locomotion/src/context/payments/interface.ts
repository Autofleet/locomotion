export type Brand = 'code' | 'alipay' | 'amex' | 'american-express' | 'cvv' | 'diners-club' | 'diners' | 'discover' | 'elo' | 'generic' | 'hiper' | 'hipercard' | 'jcb' | 'maestro' | 'mastercard' | 'visa';
export type Balance = {
    amount: number,
    currency: string
};
export interface PaymentMethodInterface {
    brand: Brand;
    createdAt: Date;
    customerId: string;
    deletedAt: Date | null;
    expiresAt: Date;
    hasOutstandingBalance: boolean;
    id: string;
    isDefault: boolean;
    isExpired: boolean;
    lastFour: string;
    name: string;
    stripeId: string;
    updatedAt: Date;
    outstandingBalance: Balance;
    type: string;
}
