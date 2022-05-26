import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import auth from '../../services/auth';
import Mixpanel from '../../services/Mixpanel';
import { useStateValue } from '../main';
import AppSettings from '../../services/app-settings';
import { loginVert, sendEmailVerification, updateUser } from '../user/api';
import PaymentsContext from '../payments';

const keyToScreen = {
  firstName: 'Name',
  lastName: 'Name',
  email: 'Email',
  avatar: 'Avatar',
  cards: 'AddCard',
  welcome: 'Welcome',
};

const authContainer = () => {
  const usePayments = PaymentsContext.useContainer();
  const [, dispatch] = useStateValue();
  const navigation = useNavigation();
  const initialState = {
    phoneNumber: '',
    firstName: '',
    lastName: '',
    avatar: '',
    email: '',
    cards: null,
  };
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
    let unfinishedScreen;
    for (const key of Object.keys(initialState)) {
      if (!user[key]) {
        unfinishedScreen = keyToScreen[key];
        break;
      }
    }
    if (unfinishedScreen) {
      navigateToScreen(unfinishedScreen);
    } else if (complete) {
      return navigation.navigate('MainApp');
    } else {
      return navigateToScreen(keyToScreen.welcome);
    }
  };

  const getCardInfo = async () => {
    try {
      const methods = await usePayments.getPaymentMethods();
      if (methods.length) {
        return methods;
      }
    } catch (e) {
      console.error(e);
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

  const verifyEmail = async (userId) => {
    await sendEmailVerification(userId);
  };

  const updateUserInfo = async (values) => {
    const user = await updateUser(values);
    if (values.email) {
      verifyEmail(user.id);
    }
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
      const cards = await getCardInfo();
      navigateBasedOnUser({ ...userProfile, cards }, true);
      return true;
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
