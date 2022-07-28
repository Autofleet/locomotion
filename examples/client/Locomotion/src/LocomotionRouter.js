import React, { useEffect, useRef } from 'react';
import { LogBox } from 'react-native';
import { enableScreens } from 'react-native-screens';
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

export default (props) => {
  const navigatorRef = useRef(null);

  useEffect(() => {
    crashlytics().log('App mounted.');
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
