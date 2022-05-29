import RideHistory from './RideHistory';
import Payments from './Payments';
import Account from './Account';
import ContactUs from './ContactUs';
import ActiveRide from './ActiveRide';

export const ROUTES_COMPS = {
  HOME: ActiveRide,
  RIDE_HISTORY: RideHistory,
  PAYMENT: Payments,
  ACCOUNT: Account,
  CONTACT_US: ContactUs,
};
