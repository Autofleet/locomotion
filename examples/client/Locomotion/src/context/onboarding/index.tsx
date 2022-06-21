import { useNavigation } from '@react-navigation/native';
import React, {
  createContext, useContext, useState,
} from 'react';
import { APP_ROUTES, MAIN_ROUTES } from '../../pages/routes';
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

const SCREEN_ORDER = [
  MAIN_ROUTES.START,
  MAIN_ROUTES.PHONE,
  MAIN_ROUTES.CODE,
  MAIN_ROUTES.NAME,
  MAIN_ROUTES.EMAIL,
  MAIN_ROUTES.AVATAR,
  MAIN_ROUTES.CARD,
  MAIN_ROUTES.WELCOME,
];

const keyToScreen: any = {
  firstName: MAIN_ROUTES.NAME,
  lastName: MAIN_ROUTES.NAME,
  email: MAIN_ROUTES.EMAIL,
  avatar: MAIN_ROUTES.AVATAR,
  cards: MAIN_ROUTES.CARD,
  welcome: MAIN_ROUTES.WELCOME,
};

const OnboardingContextProvider = ({ children }: { children: any }) => {
  const { setUser, onVert } = useContext(UserContext);
  const navigation: any = useNavigation();

  const [requiredOnboarding] = useState({
    [MAIN_ROUTES.PHONE]: true,
    [MAIN_ROUTES.CODE]: true,
    [MAIN_ROUTES.NAME]: true,
    [MAIN_ROUTES.EMAIL]: true,
    [MAIN_ROUTES.AVATAR]: false,
    [MAIN_ROUTES.CARD]: false,
  });

  const navigateToScreen = (screen: string) => navigation.navigate(screen);

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
    return navigation.navigate(APP_ROUTES.MAIN_APP);
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
