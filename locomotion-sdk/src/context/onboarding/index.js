import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import auth from '../../services/auth';
import Mixpanel from '../../services/Mixpanel';
import { useStateValue } from '../main';
import AppSettings from '../../services/app-settings';
import { loginVert, sendEmailVerification, updateUser } from '../user/api';
import PaymentsContext from '../payments';

const SCREEN_ORDER = ['phoneNumber', 'Code', 'Name', 'Email', 'Avatar', 'AddCard', 'Welcome'];
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
    email: '',
    avatar: '',
    cards: null,
  };
  const [onboardingState, setOnboardingState] = useState(initialState);
  const [requiredOnboarding] = useState({
    phoneNumber: true,
    code: true,
    name: true,
    email: true,
    avatar: false,
    cards: false,
  });
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

  const updateState = (field, value) => {
    setOnboardingState({
      ...onboardingState,
      [field]: value,
    });
  };

  const navigateToScreen = () => navigation.navigate('AuthScreens', { screen: SCREEN_ORDER[currentScreenIndex] });

  const nextScreen = () => {
    setCurrentScreenIndex(currentScreenIndex + 1);
  };

  const lastScreen = () => {
    setCurrentScreenIndex(currentScreenIndex - 1);
  };
  const navigateBasedOnUser = (user) => {
    setOnboardingState(user);
    let unfinishedScreen;
    for (const key of Object.keys(initialState)) {
      console.log({ ...initialState, ...user });
      if (!{ ...initialState, ...user }[key]) {
        unfinishedScreen = keyToScreen[key];
        break;
      }
    }
    if (!user.didCompleteOnboarding) {
      if (unfinishedScreen) {
        return setCurrentScreenIndex(SCREEN_ORDER.indexOf(unfinishedScreen));
      }
      return setCurrentScreenIndex(SCREEN_ORDER.indexOf(keyToScreen.welcome));
    }
    return navigation.navigate('MainApp');
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

  useEffect(() => {
    if (currentScreenIndex > 0) {
      navigateToScreen();
    }
  }, [currentScreenIndex]);

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
      navigateBasedOnUser({ ...userProfile, cards });
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
    requiredOnboarding,
    nextScreen,
    lastScreen,
  };
};
export default createContainer(authContainer);
