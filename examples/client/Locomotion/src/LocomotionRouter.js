import React, { useEffect, useRef } from 'react';
import { LogBox } from 'react-native';
import Config from 'react-native-config';
import { initStripe } from '@stripe/stripe-react-native';
import 'react-native-gesture-handler';
import crashlytics from '@react-native-firebase/crashlytics';
import { NavigationContainer } from '@react-navigation/native';
import { MainProvider } from './context';
import MainRouter from './pages';
import RidePopups from './popups/RidePopups';
import { setTopLevelNavigator } from './services/navigation';

LogBox.ignoreAllLogs();
const STRIPE_PUBLISHER_KEY = Config.STRIPE_PUBLISHER_KEY || '';

export default (props) => {
  const navigatorRef = useRef(null);

  useEffect(() => {
    crashlytics().log('App mounted.');
    initStripe({
      publishableKey: STRIPE_PUBLISHER_KEY,
      merchantIdentifier: 'merchant.identifier',
    });
  }, []);

  return (
    <NavigationContainer
      ref={navigatorRef}
      onReady={() => {
        if (navigatorRef) {
          setTopLevelNavigator(navigatorRef.current);
        }
      }}
    >
      <MainProvider {...props}>
        <MainRouter {...props} />
        {props.children}
        <RidePopups />
      </MainProvider>
    </NavigationContainer>
  );
};
