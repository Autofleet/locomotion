import React, { useContext, useEffect } from 'react';
import {
  Text,
  View,
} from 'react-native';
import AppSettings from '../../services/app-settings';
import { useStateValue } from '../../context/main';
import needOnboarding from './needOnBoarding';
import Auth from '../../services/auth';
import { getUserDetails } from '../../context/user/api';
import { UserContext } from '../../context/user';

const AuthLoadingScreen = ({ navigation }) => {
  const { setUser } = useContext(UserContext);
  const [appState, dispatch] = useStateValue();

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
        const userProfile = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatar: userData.avatar,
          email: userData.email,
          pushToken: userData.pushToken,
          pushUserId: userData.pushUserId,
        };

        await saveUser(userProfile);

        const nonUserNav = (screen) => {
          navigation.replace('AuthScreens', { screen, params: { showHeaderIcon: false } });
        };

        if (!userData.active) {
          return nonUserNav('Lock');
        }

        if (needOnboarding(userProfile)) {
          if (!userProfile.firstName || !userProfile.lastName) {
            return navigation.replace('AuthScreens', { screen: 'Name' });
          }
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
