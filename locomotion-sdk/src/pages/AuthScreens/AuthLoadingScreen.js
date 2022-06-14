import React, { useContext, useEffect } from 'react';
import { APP_ROUTES, MAIN_ROUTES } from '../routes';
import AppSettings from '../../services/app-settings';
import Auth from '../../services/auth';
import { getUserDetails } from '../../context/user/api';
import { OnboardingContext } from '../../context/onboarding';
import PaymentsContext from '../../context/payments';
import { UserContext } from '../../context/user';

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
  const usePayments = PaymentsContext.useContainer();

  const saveUser = (userProfile) => {
    setUser(userProfile);
    return AppSettings.update({ userProfile });
  };

  const init = () => {
    async function getFromStorage() {
      const payload = await AppSettings.getSettings();

      if (payload.userProfile) {
        const response = await getUserDetails();
        if (!response) {
          Auth.logout(navigation);
        }

        const userData = response;
        const cards = null;
        try {
          ({ cards: paymentMethods } = await usePayments.loadCustomer());
        } catch (e) {
          console.log(e);
        }

        userData.cards = cards;

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

    if (!user) { // Load app state
      getFromStorage();
    }
  };
  useEffect(init, []);
  return (
    <></>
  );
};
export default AuthLoadingScreen;
