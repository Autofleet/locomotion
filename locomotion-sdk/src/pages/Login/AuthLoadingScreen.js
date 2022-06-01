import React, { useContext, useEffect } from 'react';
import {
  Text,
  View,
} from 'react-native';
import AppSettings from '../../services/app-settings';
import { useStateValue } from '../../context/state';
import needOnboarding from './needOnBoarding';
import Auth from '../../services/auth';
import { getUserDetails } from '../../context/user/api';
import onboardingContext from '../../context/onboarding';
import PaymentsContext from '../../context/payments';
import { UserContext } from '../../context/user';

const AuthLoadingScreen = ({ navigation }) => {
  const { setUser } = useContext(UserContext);
  const [appState, dispatch] = useStateValue();
  const { navigateBasedOnUser } = onboardingContext.useContainer();
  const usePayments = PaymentsContext.useContainer();

  const saveUser = (userProfile) => {
    setUser(userProfile);
    return AppSettings.update({ userProfile });
  };

  const init = () => {
    async function getFromStorage() {
      const payload = await AppSettings.getSettings();

      await dispatch({
        type: 'changeState',
        payload,
      });

      if (payload.userProfile) {
        const response = await getUserDetails();
        if (!response) {
          Auth.logout(navigation);
        }

        const userData = response;
        let cards = null;
        try {
          cards = await usePayments.getPaymentMethods();
        } catch (e) {
          console.log(e);
        }

        userData.cards = cards;

        await saveUser(userData);

        const nonUserNav = (screen) => {
          navigation.replace('AuthScreens', { screen, params: { showHeaderIcon: false } });
        };

        if (!userData.active) {
          return nonUserNav('Lock');
        }

        if (needOnboarding(userData)) {
          return navigateBasedOnUser(userData);
        }

        return navigation.replace('MainApp');
      }

      navigation.replace('AuthScreens');
    }

    if (!appState) { // Load app state
      getFromStorage();
    }
  };
  useEffect(init, []);
  return (
    <View>
      <Text>Loading</Text>
    </View>
  );
};
export default AuthLoadingScreen;
