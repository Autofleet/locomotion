
const settingsDefaults = {
  ARRIVE_REMINDER_MIN: 3,
  MANUAL_APPROVAL: false,
  PRIVACY_URL: 'https://www.autofleet.io/404',
  TERMS_URL: 'https://www.autofleet.io/404',
  CONTACT_US_URL: 'https://www.autofleet.io/404',
  DISPLAY_ETA_DRIFT: 0,
  DISPLAY_MAX_ETA_DRIFT: 0,
  ETA_MEDIUM_THRESHOLD: 10,
  ETA_HIGH_THRESHOLD: 30,
  OFFER_EXPIRATION_TIME: 30,
  FUTURE_ORDER_MIN_TIME: 30,
  FUTURE_ORDER_MAX_TIME: 96,
  FUTURE_ORDER_TIME_INTERVAL: 15,
  MAX_FUTURE_RIDES: 1,
  BEFORE_TIME_WINDOW_MINUTES: 10,
};

module.exports = settingsDefaults;
