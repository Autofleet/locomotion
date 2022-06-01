import { ROUTES } from './routes';
import RideHistory from './RideHistory';
import Payments from './Payments';
import Account from './Account';
import ContactUs from './ContactUs';
import ActiveRide from './ActiveRide';
import WebViewPage from './WebViewPage';

export const ROUTES_COMPS = {
  [ROUTES.HOME]: ActiveRide,
  [ROUTES.RIDE_HISTORY]: RideHistory,
  [ROUTES.PAYMENT]: Payments,
  [ROUTES.ACCOUNT]: Account,
  [ROUTES.CONTACT_US]: ContactUs,
  [ROUTES.WEBVIEW]: WebViewPage,
};
