import React, { useContext, useEffect } from 'react';
import { initStripe } from '@stripe/stripe-react-native';
import Config from 'react-native-config';
import moment from 'moment';
import { Platform } from 'react-native';
import { APP_ROUTES, MAIN_ROUTES } from '../routes';
import logout from '../../services/logout';
import { getUserDetails } from '../../context/user/api';
import { OnboardingContext } from '../../context/onboarding';
import PaymentsContext from '../../context/payments';
import { UserContext } from '../../context/user';
import settings from '../../context/settings';
import { StorageService } from '../../services';
import FullPageLoader from '../../Components/FullPageLoader';
import * as navigationService from '../../services/navigation';

export const INITIAL_USER_STATE = {
  phoneNumber: '',
  firstName: '',
  lastName: '',
  email: '',
  avatar: '',
  cards: null,
  pushToken: '',
  pushUserId: '',
};

const AuthLoadingScreen = () => {
  const { setUser, user, updateUser } = useContext(UserContext);
  const { navigateBasedOnUser } = useContext(OnboardingContext);
  const { getSettingByKey, getAppSettings } = settings.useContainer();

  const usePayments = PaymentsContext.useContainer();

  const saveUser = (clientProfile) => {
    setUser(clientProfile);
    return StorageService.save({ clientProfile });
  };

  const init = async () => {
    async function getFromStorage() {
      const clientProfile = await StorageService.get('clientProfile');
      if (clientProfile) {
        let response;
        try {
          response = await getUserDetails();
          if (!response) {
            logout();
          }
        } catch (e) {
          logout();
        }

        const userData = response;
        const [paymentAccount] = await Promise.all([
          usePayments.getOrFetchClientPaymentAccount(),
          usePayments.loadCustomer(),
          updateUser({
            lastLogin: moment().toDate(),
            deviceType: Platform.OS,
          }),
        ]);


        initStripe({
          publishableKey: Config.STRIPE_PUBLISHER_KEY,
          merchantIdentifier: 'merchant.identifier',
          stripeAccountId: paymentAccount.stripeId,
        });
        await saveUser(userData);

        if (!userData.active) {
          return navigationService.replace(MAIN_ROUTES.LOCK, { params: { showHeaderIcon: false } });
        }

        if (!userData.didCompleteOnboarding) {
          return navigateBasedOnUser(userData);
        }

        const nav = navigationService.getNavigator();
        const currentRoute = nav.getCurrentRoute();

        if (currentRoute.name === APP_ROUTES.AUTH_LOADING) {
          return navigationService.replace(APP_ROUTES.MAIN_APP);
        }

        return true;
      }
      setUser(INITIAL_USER_STATE);
      navigationService.replace(MAIN_ROUTES.START);
    }

    await getAppSettings();
    if (!user) { // Load app state
      getFromStorage();
    }
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <FullPageLoader />
    </>
  );
};
export default AuthLoadingScreen;
