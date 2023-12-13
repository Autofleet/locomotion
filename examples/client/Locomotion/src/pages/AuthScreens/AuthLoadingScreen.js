import React, { useContext, useEffect, useState } from 'react';
import { initStripe } from '@stripe/stripe-react-native';
import moment from 'moment';
import { Platform } from 'react-native';
import AppSettings from '../../services/app-settings';
import { APP_ROUTES, MAIN_ROUTES } from '../routes';
import { logout } from '../../services/logout';
import { getUserDetails } from '../../context/user/api';
import { OnboardingContext } from '../../context/onboarding';
import PaymentsContext from '../../context/payments';
import { UserContext } from '../../context/user';
import settings from '../../context/settings';
import { StorageService } from '../../services';
import FullPageLoader from '../../Components/FullPageLoader';
import * as navigationService from '../../services/navigation';
import networkInfo from '../../services/networkInfo';
import GenericErrorPopup from '../../popups/GenericError';
import i18n from '../../I18n';
import Mixpanel from '../../services/Mixpanel';
import DeviceService from '../../services/device';

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
  const [isConnected, setIsConnected] = useState(true);
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
            appVersion: DeviceService.getVersion(),
          }),
        ]);

        const publishableKey = await AppSettings.getStripeKey();
        initStripe({
          publishableKey,
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

    await networkInfo.fetchData();
    await getAppSettings();
    if (!user) { // Load app state
      getFromStorage();
    }
  };
  useEffect(() => {
    init();
    let unsubscribeFunction;
    setTimeout(() => {
      unsubscribeFunction = networkInfo.addEventListener((listener) => {
        setIsConnected(listener.isConnected);
        if (!(listener.isConnected)) {
          Mixpanel.setEvent('No connection popup showed');
        }
      });
    }, 3000);

    return () => {
      if (unsubscribeFunction) {
        unsubscribeFunction();
      }
    };
  }, []);
  return (
    <>
      <FullPageLoader />
      <GenericErrorPopup
        isVisible={!isConnected}
        title={i18n.t('popups.noConnection.title')}
        text={i18n.t('popups.noConnection.text')}
        buttonText={i18n.t('popups.noConnection.buttonText')}
        closePopup={() => {
          Mixpanel.clickEvent('No connection popup clicked');
          setIsConnected(true);
        }}
      />
    </>
  );
};
export default AuthLoadingScreen;
