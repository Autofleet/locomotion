export const STOP_POINT_TYPES = {
  STOP_POINT_DROPOFF: 'dropoff',
  STOP_POINT_PICKUP: 'pickup',
  STOP_POINT_MULTI: 'multi',
};

export const STOP_POINT_STATES = {
  COMPLETED: 'completed',
  ARRIVED: 'arrived',
  PENDING: 'pending',
};

export const PAYMENT_STATES = {
  PENDING: 'pending',
  PAID: 'paid',
  REJECTED: 'rejected',
  SETTLED: 'settled',
  CANCELED: 'canceled',
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  OFFLINE: 'offline',
  EXTERNAL: 'external',
  APPLE_PAY: 'apple-pay',
  GOOGLE_PAY: 'google-pay',
};

export const RIDE_STATES = {
  OFFER: 'offer',
  OFFER_REJECTED: 'offer-rejected',
  MATCHING: 'matching',
  REJECTED: 'rejected',
  CANCELED: 'canceled',
  COMPLETED: 'completed',
  DISPATCHED: 'dispatched',
  PENDING: 'pending',
  ACTIVE: 'active',
  FAILED: 'failed',
};

export const RIDE_ACTIVE_STATES = [
  RIDE_STATES.PENDING,
  RIDE_STATES.MATCHING,
  RIDE_STATES.DISPATCHED,
  RIDE_STATES.ACTIVE,
];

export const CHARGE_FOR_TIP = 'tip';

export const RIDE_FINAL_STATES = Object.values(RIDE_STATES)
  .filter(state => !RIDE_ACTIVE_STATES.find(as => as === state));
export const isPickup = (sp: any) => sp.type === STOP_POINT_TYPES.STOP_POINT_PICKUP;

export const formatUiDisplaySpType = (sp: any, index: number | null) => {
  if (isPickup(sp) && (sp.orderInParent > 0 || (index && index > 0))) {
    return STOP_POINT_TYPES.STOP_POINT_MULTI;
  }
  return sp.type || STOP_POINT_TYPES.STOP_POINT_PICKUP;
};
export const isMulti = (sp: any) => formatUiDisplaySpType(sp, null)
=== STOP_POINT_TYPES.STOP_POINT_MULTI;

export const COUPON_TYPE = 'coupon';
