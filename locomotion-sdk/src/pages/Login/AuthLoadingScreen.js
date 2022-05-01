import React, { useEffect } from 'react';
import {
  Text,
  View,
} from 'react-native';
import AppSettings from '../../services/app-settings';
import { useStateValue } from '../../context/main';
import { needOnboarding } from '../Onboarding';
import network from '../../services/network';
import Auth from '../../services/auth';
import { getUserDetails } from '../../context/user';

const AuthLoadingScreen = ({ navigation }) => {
  const [appState, dispatch] = useStateValue();
  const init = () => {
    async function getFromStorage() {
      const payload = await AppSettings.getSettings();

      await dispatch({
        type: 'changeState',
        payload,
      });

      let page = payload.userProfile ? 'App' : 'Auth';

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

        AppSettings.update({ userProfile });

        if (!userData.active) {
          page = 'Lock';
        }

        if (needOnboarding(userProfile)) {
          page = 'Onboarding';
        }
      }

      navigation.navigate(page, { showHeaderIcon: false });
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
