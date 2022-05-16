import React, { useEffect } from 'react';
import {
  Text,
  View,
} from 'react-native';
import AppSettings from '../../services/app-settings';
import { useStateValue } from '../../context/main';
import { needOnboarding } from '../Onboarding';
import Auth from '../../services/auth';
import { getUserDetails } from '../../context/user/api';

const AuthLoadingScreen = ({ navigation }) => {
  const [appState, dispatch] = useStateValue();
  const init = () => {
    async function getFromStorage() {
      const payload = await AppSettings.getSettings();

      await dispatch({
        type: 'changeState',
        payload,
      });

      if (payload.userProfile) {
        const response = await getUserDetails()
        if (!response || response.data === null) {
          Auth.logout(navigation);
        }

        const userData = response.data
        const userProfile = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatar: userData.avatar,
          email: userData.email,
          pushToken: userData.pushToken,
          pushUserId: userData.pushUserId,
        };

        await AppSettings.update({ userProfile });

        const nonUserNav = (screen) => {
          navigation.replace('AuthScreens', { screen, params: { showHeaderIcon: false }});
        }

        if (!userData.active) {
         return nonUserNav('Lock')
        }

        if (needOnboarding(userProfile)) {
          if (!userProfile.firstName || !userProfile.lastName) {
            return navigation.replace('AuthScreens', { screen: 'Name' })
          }
        }
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
