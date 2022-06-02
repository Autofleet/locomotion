import React, { useContext, useEffect } from 'react';
import {
  Text,
  View,
} from 'react-native';
import AppSettings from '../../services/app-settings';
import Auth from '../../services/auth';
import { getUserDetails } from '../../context/user/api';
import { OnboardingContext } from '../../context/onboarding';
import PaymentsContext from '../../context/payments';
import { UserContext } from '../../context/user';

const INITIAL_USER_STATE = {
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

        if (!userData.didCompleteOnboarding) {
          return navigateBasedOnUser(userData);
        }

        return navigation.replace('MainApp');
      }
      setUser(INITIAL_USER_STATE);
      navigation.replace('AuthScreens');
    }

    if (!user) { // Load app state
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
