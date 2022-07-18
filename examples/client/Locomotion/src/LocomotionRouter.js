import React, { useEffect, useRef } from 'react';
import { LogBox } from 'react-native';
import Config from 'react-native-config';
import { enableScreens } from 'react-native-screens';
import { initStripe } from '@stripe/stripe-react-native';
import 'react-native-gesture-handler';
import crashlytics from '@react-native-firebase/crashlytics';
import { NavigationContainer } from '@react-navigation/native';
import { MainProvider, RideStateContextContextProvider } from './context';
import MainRouter from './pages';
import RidePopups from './popups/RidePopups';
import { setTopLevelNavigator } from './services/navigation';
import NewRidePageContextProvider from './context/newRideContext';
import BottomSheetContextProvider from './context/bottomSheetContext';
import FutureRidesProvider from './context/futureRides';

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
    enableScreens(false);
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
        <BottomSheetContextProvider {...props}>
          <RideStateContextContextProvider {...props}>
            <FutureRidesProvider {...props}>
            <NewRidePageContextProvider {...props}>
              <MainRouter {...props} />
              {props.children}
              <RidePopups />
            </NewRidePageContextProvider>
            </FutureRidesProvider>
          </RideStateContextContextProvider>
        </BottomSheetContextProvider>
      </MainProvider>
    </NavigationContainer>
  );
};
