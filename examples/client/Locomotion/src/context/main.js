import React from 'react';
import { RideHistoryContextProvider } from './rideHistory';
import I18n from '../I18n';
import SettingsContext from './settings';
import PaymentsContext from './payments';
import ThemeProvider from './theme';
import UserContextProvider from './user';
import OnboardingContextProvider from './onboarding';
import { StateProvider } from './state';
import BottomSheetContextProvider from './bottomSheetContext';

export const MainProvider = ({ children, LoginPage, i18n }) => {
  const initialState = null;
  if (i18n) {
    i18n.translations.map(async (lng) => {
      await I18n.addResourceBundle(lng.lang, 'translation', lng.translation, true, true);
    });

    if (i18n.default) {
      I18n.changeLanguage(i18n.default);
    }
  }

  const reducer = (state, action) => {
    if (action && action.type) {
      switch (action.type) {
        case 'changeState':
          return {
            ...state,
            ...action.payload,
          };
      }
    }
    return state;
  };


  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <BottomSheetContextProvider>
        <SettingsContext.Provider>
          <PaymentsContext.Provider>
            <ThemeProvider>
              <UserContextProvider>
                <OnboardingContextProvider>
                  <RideHistoryContextProvider>
                    {children}
                  </RideHistoryContextProvider>
                </OnboardingContextProvider>
              </UserContextProvider>
            </ThemeProvider>
          </PaymentsContext.Provider>
        </SettingsContext.Provider>
      </BottomSheetContextProvider>
    </StateProvider>
  );
};

export default {
  MainProvider,
};
