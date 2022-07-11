import { useNavigation } from '@react-navigation/native';
import React, {
  createContext, useContext, useState,
} from 'react';
import settings from '../settings';
import SETTINGS_KEYS from '../settings/keys';
import { APP_ROUTES, MAIN_ROUTES } from '../../pages/routes';
import { UserContext } from '../user';

interface OnboardingContextInterface {
  verifyCode: (code: string) => Promise<boolean | void>,
  navigateBasedOnUser: (user: any) => void,
  requiredOnboarding: any,
  nextScreen: (currentScreen: string) => void,
}

export const OnboardingContext = createContext<OnboardingContextInterface>({
  verifyCode: async code => undefined,
  navigateBasedOnUser: user => undefined,
  requiredOnboarding: {},
  nextScreen: (currentScreen: string) => undefined,
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
  const { getSettingByKey } = settings.useContainer();

  const [requiredOnboarding, setRequiredOnboarding] = useState({
    [MAIN_ROUTES.PHONE]: true,
    [MAIN_ROUTES.CODE]: true,
    [MAIN_ROUTES.NAME]: true,
    [MAIN_ROUTES.EMAIL]: true,
    [MAIN_ROUTES.AVATAR]: false,
    [MAIN_ROUTES.CARD]: false,
  });

  const navigateToScreen = (screen: string) => navigation.navigate(screen);

  const shouldShowCardPage = async () => {
    const cardPageSettings = await getSettingByKey(
      SETTINGS_KEYS.CARD_PAGE_SETTINGS,
    );

    if (cardPageSettings) {
      const {
        showCardPage,
        canSkipCardPage,
      } = cardPageSettings;
      if (showCardPage) {
        setRequiredOnboarding({
          ...requiredOnboarding,
          [MAIN_ROUTES.CARD]: !canSkipCardPage,
        });

        return true;
      }
    }

    return false;
  };

  const nextScreen = async (currentScreen: string) => {
    const currentIndex = SCREEN_ORDER.indexOf(currentScreen);
    let nextScreenToShow = SCREEN_ORDER[currentIndex + 1];

    if (nextScreenToShow === MAIN_ROUTES.CARD) {
      const showCardPage = await shouldShowCardPage();
      if (!showCardPage) {
        nextScreenToShow = SCREEN_ORDER[currentIndex + 2];
      }
    }
    navigateToScreen(nextScreenToShow);
  };

  const navigateBasedOnUser = async (user: any) => {
    setUser(user);
    if (!user.didCompleteOnboarding) {
      let unfinishedScreen: string | undefined = Object.keys(keyToScreen).find(key => !user[key]);
      if (unfinishedScreen === MAIN_ROUTES.CARD) {
        const showCardPage = await shouldShowCardPage();
        if (!showCardPage) {
          unfinishedScreen = undefined;
        }
      }
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
