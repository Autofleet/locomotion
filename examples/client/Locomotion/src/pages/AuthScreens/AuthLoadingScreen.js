import React, { useContext, useEffect } from 'react';
import { initStripe } from '@stripe/stripe-react-native';
import Config from 'react-native-config';
import { APP_ROUTES, MAIN_ROUTES } from '../routes';
import Auth from '../../services/auth';
import { getUserDetails } from '../../context/user/api';
import { OnboardingContext } from '../../context/onboarding';
import PaymentsContext from '../../context/payments';
import { UserContext } from '../../context/user';
import settings from '../../context/settings';
import SETTINGS_KEYS from '../../context/settings/keys';
import { StorageService } from '../../services';
import FullPageLoader from '../../Components/FullPageLoader';
import { checkVersionAndForceUpdateIfNeeded } from '../../services/VersionCheck';

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

const AuthLoadingScreen = ({ navigation }) => {
  const { setUser, user } = useContext(UserContext);
  const { navigateBasedOnUser } = useContext(OnboardingContext);
  const { getSettingByKey, getAppSettings } = settings.useContainer();

  const usePayments = PaymentsContext.useContainer();

  const saveUser = (clientProfile) => {
    setUser(clientProfile);
    return StorageService.save({ clientProfile });
  };

  const versionCheck = async () => {
    const minAppVersion = await getSettingByKey(
      SETTINGS_KEYS.MIN_APP_VERSION,
    );

    await checkVersionAndForceUpdateIfNeeded(minAppVersion);
  };

  const init = async () => {
    async function getFromStorage() {
      const clientProfile = await StorageService.get('clientProfile');
      if (clientProfile) {
        let response;
        try {
          response = await getUserDetails();
          if (!response) {
            Auth.logout();
          }
        } catch (e) {
          Auth.logout();
        }

        const userData = response;
        const [paymentAccount] = await Promise.all([
          usePayments.getOrFetchClientPaymentAccount(),
          usePayments.loadCustomer(),
        ]);


        initStripe({
          publishableKey: Config.STRIPE_PUBLISHER_KEY,
          merchantIdentifier: 'merchant.identifier',
          stripeAccountId: paymentAccount.stripeId,
        });
        await saveUser(userData);

        if (!userData.active) {
          return navigation.replace(MAIN_ROUTES.LOCK, { params: { showHeaderIcon: false } });
        }

        if (!userData.didCompleteOnboarding) {
          return navigateBasedOnUser(userData);
        }

        return navigation.replace(APP_ROUTES.MAIN_APP);
      }
      setUser(INITIAL_USER_STATE);
      navigation.navigate(MAIN_ROUTES.START);
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
