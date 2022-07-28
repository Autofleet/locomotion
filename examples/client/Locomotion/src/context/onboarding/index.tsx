import { useNavigation } from '@react-navigation/native';
import React, {
  createContext, useContext, useState,
} from 'react';
import { initStripe } from '@stripe/stripe-react-native';
import Config from 'react-native-config';
import settings from '../settings';
import SETTINGS_KEYS from '../settings/keys';
import * as navigationService from '../../services/navigation';
import { APP_ROUTES, MAIN_ROUTES } from '../../pages/routes';
import { UserContext } from '../user';
import payments from '../payments';

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
  MAIN_ROUTES.EMAIL_CODE,
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
  const {
    getOrFetchClientPaymentAccount,
    loadCustomer,
  } = payments.useContainer();
  const [requiredOnboarding, setRequiredOnboarding] = useState({
    [MAIN_ROUTES.PHONE]: true,
    [MAIN_ROUTES.CODE]: true,
    [MAIN_ROUTES.NAME]: true,
    [MAIN_ROUTES.EMAIL]: true,
    [MAIN_ROUTES.EMAIL_CODE]: false,
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

      return false;
    }

    return true;
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
    const [paymentAccount] = await Promise.all([
      getOrFetchClientPaymentAccount(),
      loadCustomer(),
    ]);

    initStripe({
      publishableKey: Config.STRIPE_PUBLISHER_KEY,
      merchantIdentifier: 'merchant.identifier',
      stripeAccountId: paymentAccount.stripeId,
    });
    setUser(user);
    if (!user.didCompleteOnboarding) {
      const screenKey: string | undefined = Object.keys(keyToScreen).find(key => !user[key]);
      let unfinishedScreen = screenKey ? keyToScreen[screenKey] : keyToScreen.welcome;
      if (unfinishedScreen === MAIN_ROUTES.CARD) {
        const showCardPage = await shouldShowCardPage();
        if (!showCardPage) {
          unfinishedScreen = keyToScreen.welcome;
        }
      }
      return navigateToScreen(unfinishedScreen);
    }
    return navigationService.navigate(MAIN_ROUTES.HOME, {}, APP_ROUTES.MAIN_APP);
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
