export const STOP_POINT_TYPES = {
  STOP_POINT_DROPOFF: 'dropoff',
  STOP_POINT_PICKUP: 'pickup',
};

export const STOP_POINT_STATES = {
  COMPLETED: 'completed',
  ARRIVED: 'arrived',
  PENDING: 'pending',
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
