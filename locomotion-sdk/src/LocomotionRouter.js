import React, { useEffect } from 'react';
import params from 'react-native-config';
import { initStripe } from '@stripe/stripe-react-native';

import { MainProvider } from './context/main';
// import StorybookUI from './storybook';
//import Router, { MainRouter } from './pages';
import Router, { MainRouter } from './pages';
import NavigationService from './services/navigation';
// import Firebase from './src/services/firebase';

import RidePopups from './popups/RidePopups';
import SettingsContext from './context/settings'
import PaymentsContext from './context/payments'

export default props => {
  useEffect(() => {
    initStripe({
      publishableKey: process.env.STRIPE_PUBLISHER_KEY,
      merchantIdentifier: 'merchant.identifier',
    });
  }, []);

 return  (
   <MainProvider {...props}>
    <SettingsContext.Provider>
      <PaymentsContext.Provider>
        <MainRouter
          ref={navigation => NavigationService.setTopLevelNavigator(navigation)}
          {...props}
          />
        {props.children}
        {/*  Popups */}
        <RidePopups />
      </PaymentsContext.Provider>
    </SettingsContext.Provider>
  </MainProvider>
)};
