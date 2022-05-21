import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { debounce } from "lodash";
import { createContainer } from 'unstated-next';
import auth from '../../services/auth';
import Mixpanel from '../../services/Mixpanel';
import { useStateValue } from '../main';
import AppSettings from '../../services/app-settings';
import { loginVert, sendEmailVerification, updateUser } from '../user/api';

const keyToScreen = {
  firstName: 'Name',
  lastName: 'Name',
  email: 'Email',
  avatar: 'Avatar',
  welcome: 'Welcome'
  }

const authContainer = () => {
  const [, dispatch] = useStateValue();
  const navigation = useNavigation();
  const initialState = {
    phoneNumber: '',
    firstName: '',
    lastName: '',
    avatar: '',
    email: '',
  }
  const [onboardingState, setOnboardingState] = useState(initialState);

  const updateState = (field, value) => {
    setOnboardingState({
      ...onboardingState,
      [field]: value,
    });
  };

  const navigateToScreen = screen => navigation.navigate('AuthScreens', { screen });


  const navigateBasedOnUser = (user, complete) => {
    setOnboardingState(user);
    let screen;
    for (let key of Object.keys(initialState)) {
      if (!user[key]) {
        screen = keyToScreen[key]
        break;
      }
    }
    if (screen) {
      navigateToScreen(screen);
    } else if (complete) {
      return navigation.navigate('MainApp');
    } else {
      return navigateToScreen(keyToScreen.welcome)
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

  const verifyEmail = () => {
    sendEmailVerification(onboardingState.id);
  };

  const updateUserInfo = async (values) => {
    if (values.email) {
      verifyEmail(values.email);
    }
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
