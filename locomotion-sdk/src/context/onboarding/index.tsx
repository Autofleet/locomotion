import { useNavigation } from '@react-navigation/native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ONBOARDING_PAGE_NAMES } from '../../pages/routes';
import { UserContext } from '../user';

interface OnboardingContextInterface {
  verifyCode: (code: string) => Promise<boolean | void>,
  navigateBasedOnUser: (user: any) => void,
  requiredOnboarding: {},
  nextScreen: () => void,
  lastScreen: () => void,
  setCurrentScreenIndex: any,
}

export const OnboardingContext = createContext<OnboardingContextInterface>({
  verifyCode: async (code) => {},
  navigateBasedOnUser: (user) => {},
  requiredOnboarding: {},
  nextScreen: () => {},
  lastScreen: () => {},
  setCurrentScreenIndex: () => {},
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
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

  const navigateToScreen = () => navigation.navigate('AuthScreens', { screen: SCREEN_ORDER[currentScreenIndex] });

  const nextScreen = () => {
    setCurrentScreenIndex(currentScreenIndex + 1);
  };

  const lastScreen = () => {
    setCurrentScreenIndex(currentScreenIndex - 1);
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
        return setCurrentScreenIndex(SCREEN_ORDER.indexOf(unfinishedScreen));
      }
      return setCurrentScreenIndex(SCREEN_ORDER.indexOf(keyToScreen.welcome));
    }
    return navigation.navigate('MainApp');
  };

  useEffect(() => {
    if (currentScreenIndex > 0) {
      navigateToScreen();
    }
  }, [currentScreenIndex]);

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
        lastScreen,
        setCurrentScreenIndex,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingContextProvider;
