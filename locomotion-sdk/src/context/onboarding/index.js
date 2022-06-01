import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import auth from '../../services/auth';
import Mixpanel from '../../services/Mixpanel';
import { useStateValue } from '../state';
import AppSettings from '../../services/app-settings';
import { loginVert, sendEmailVerification, updateUser } from '../user/api';
import PaymentsContext from '../payments';
import { ONBOARDING_PAGE_NAMES } from '../../pages/consts';

const SCREEN_ORDER = [ONBOARDING_PAGE_NAMES.START, ONBOARDING_PAGE_NAMES.PHONE, ONBOARDING_PAGE_NAMES.CODE, ONBOARDING_PAGE_NAMES.NAME, ONBOARDING_PAGE_NAMES.EMAIL, ONBOARDING_PAGE_NAMES.AVATAR, ONBOARDING_PAGE_NAMES.CARD, ONBOARDING_PAGE_NAMES.WELCOME];
const keyToScreen = {
  firstName: ONBOARDING_PAGE_NAMES.NAME,
  lastName: ONBOARDING_PAGE_NAMES.NAME,
  email: ONBOARDING_PAGE_NAMES.EMAIL,
  avatar: ONBOARDING_PAGE_NAMES.AVATAR,
  cards: ONBOARDING_PAGE_NAMES.CARD,
  welcome: ONBOARDING_PAGE_NAMES.WELCOME,
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
    [ONBOARDING_PAGE_NAMES.PHONE]: true,
    [ONBOARDING_PAGE_NAMES.CODE]: true,
    [ONBOARDING_PAGE_NAMES.NAME]: true,
    [ONBOARDING_PAGE_NAMES.EMAIL]: true,
    [ONBOARDING_PAGE_NAMES.AVATAR]: false,
    [ONBOARDING_PAGE_NAMES.CARD]: false,
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
      if (!user[key]) {
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
    setCurrentScreenIndex
  };
};
export default createContainer(authContainer);
