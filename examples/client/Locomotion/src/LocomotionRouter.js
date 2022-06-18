import React, {useEffect} from 'react';
import Config from 'react-native-config';
import {initStripe} from '@stripe/stripe-react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {MainProvider} from './context';
import MainRouter from './pages';
import RidePopups from './popups/RidePopups';

const STRIPE_PUBLISHER_KEY = Config.STRIPE_PUBLISHER_KEY || '';

export default props => {
  useEffect(() => {
    initStripe({
      publishableKey: STRIPE_PUBLISHER_KEY,
      merchantIdentifier: 'merchant.identifier',
    });
  }, []);

  return (
    <NavigationContainer>
      <MainProvider {...props}>
        <MainRouter {...props} />
        {props.children}
        <RidePopups />
      </MainProvider>
    </NavigationContainer>
  );
};
