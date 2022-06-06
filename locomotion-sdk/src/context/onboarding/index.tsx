import { useNavigation, useRoute } from '@react-navigation/native';
import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { NAVIGATION_CONTAINERS, ONBOARDING_PAGE_NAMES } from '../../pages/routes';
import { UserContext } from '../user';

interface OnboardingContextInterface {
  verifyCode: (code: string) => Promise<boolean | void>,
  navigateBasedOnUser: (user: any) => void,
  requiredOnboarding: {},
  nextScreen: (currentScreen: string) => void,
}

export const OnboardingContext = createContext<OnboardingContextInterface>({
  verifyCode: async (code) => {},
  navigateBasedOnUser: (user) => {},
  requiredOnboarding: {},
  nextScreen: (currentScreen: string) => {},
});

const SCREEN_ORDER = [ONBOARDING_PAGE_NAMES.START, ONBOARDING_PAGE_NAMES.PHONE, ONBOARDING_PAGE_NAMES.CODE, ONBOARDING_PAGE_NAMES.NAME, ONBOARDING_PAGE_NAMES.EMAIL, ONBOARDING_PAGE_NAMES.AVATAR, ONBOARDING_PAGE_NAMES.CARD, ONBOARDING_PAGE_NAMES.WELCOME];
const keyToScreen: any = {
  firstName: ONBOARDING_PAGE_NAMES.NAME,
  lastName: ONBOARDING_PAGE_NAMES.NAME,
  email: ONBOARDING_PAGE_NAMES.EMAIL,
  avatar: ONBOARDING_PAGE_NAMES.AVATAR,
  cards: ONBOARDING_PAGE_NAMES.CARD,
  welcome: ONBOARDING_PAGE_NAMES.WELCOME,
};

const OnboardingContextProvider = ({ children }: { children: any }) => {
  const { setUser, onVert } = useContext(UserContext);
  const navigation: any = useNavigation();

  const [requiredOnboarding] = useState({
    [ONBOARDING_PAGE_NAMES.PHONE]: true,
    [ONBOARDING_PAGE_NAMES.CODE]: true,
    [ONBOARDING_PAGE_NAMES.NAME]: true,
    [ONBOARDING_PAGE_NAMES.EMAIL]: true,
    [ONBOARDING_PAGE_NAMES.AVATAR]: false,
    [ONBOARDING_PAGE_NAMES.CARD]: false,
  });

  const navigateToScreen = (screen: string) => navigation.navigate(NAVIGATION_CONTAINERS.AUTH_SCREENS, { screen });

  const nextScreen = (currentScreen: string) => {
    const currentIndex = SCREEN_ORDER.indexOf(currentScreen);
    navigateToScreen(SCREEN_ORDER[currentIndex + 1]);
  };

  const navigateBasedOnUser = (user: any) => {
    setUser(user);
    let unfinishedScreen;
    for (const key of Object.keys(keyToScreen)) {
      if (!user[key]) {
        unfinishedScreen = keyToScreen[key];
        break;
      }
    }
    if (!user.didCompleteOnboarding) {
      if (unfinishedScreen) {
        return navigateToScreen(unfinishedScreen);
      }
      return navigateToScreen(keyToScreen.welcome);
    }
    return navigation.navigate(NAVIGATION_CONTAINERS.MAIN_APP);
  };

  const verifyCode = async (code: string) => {
    const userProfile = await onVert(code);
    if (userProfile) {
      navigateBasedOnUser(userProfile);
      return true;
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        verifyCode,
        navigateBasedOnUser,
        requiredOnboarding,
        nextScreen,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingContextProvider;
