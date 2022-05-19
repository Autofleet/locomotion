import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import auth from '../../services/auth';
import Mixpanel from '../../services/Mixpanel';
import { useStateValue } from '../main';
import AppSettings from '../../services/app-settings';
import { loginVert, updateUser } from '../user/api';

const authContainer = () => {
  const [, dispatch] = useStateValue();
  const navigation = useNavigation();
  const [onboardingState, setOnboardingState] = useState({
    phoneNumber: '',
    firstName: '',
    lastName: '',
    avatar: '',
    email: '',
  });

  const updateState = (field, value) => {
    setOnboardingState({
      ...onboardingState,
      [field]: value,
    });
  };

  const navigateBasedOnUser = (user, complete) => {
    setOnboardingState(user);
    if (!user.firstName || !user.lastName) {
      return navigation.navigate('AuthScreens', { screen: 'Name' });
    }
    if (!user.avatar && !user.email) {
      return navigation.navigate('AuthScreens', { screen: 'Avatar' });
    }
    if (!user.email) {
      return navigation.navigate('AuthScreens', { screen: 'Email' });
    }
    if (!user.avatar && !user.email) {
      return navigation.navigate('AuthScreens', { screen: 'Avatar' });
    }
    if (complete) {
      navigation.navigate('MainApp');
    } else {
      navigation.navigate('AuthScreens', { screen: 'Welcome' });
    }
  };

  const getUserFromStorage = async () => {
    const settings = await AppSettings.getSettings();
    if (settings.userProfile) {
      setOnboardingState(settings.userProfile);
    }
  };

  useEffect(() => {
    getUserFromStorage();
  }, []);

  const updateUserInfo = async (values) => {
    const user = await updateUser(values);
    dispatch({
      type: 'saveState',
      payload: {
        auth: true,
        userProfile: user,
      },
    });
  };

  const onVert = async (code) => {
    try {
      const vertResponse = await loginVert({
        phoneNumber: onboardingState.phoneNumber,
        code,
      });

      if (vertResponse.status !== 'OK' || !vertResponse.refreshToken || !vertResponse.accessToken) {
        console.log('Bad vert with response', vertResponse);
        return false;
      }

      auth.updateTokens(vertResponse.refreshToken, vertResponse.accessToken);
      const userProfile = vertResponse.userProfile || {};
      Mixpanel.setUser(userProfile);
      dispatch({
        type: 'saveState',
        payload: {
          auth: true,
          userProfile,
        },
      });
      navigateBasedOnUser(userProfile, true);
    } catch (e) {
      console.log('Bad vert with request', e);
      return false;
    }
  };


  return {
    onboardingState,
    updateState,
    onVert,
    updateUserInfo,
    navigateBasedOnUser,
  };
};
export default createContainer(authContainer);
