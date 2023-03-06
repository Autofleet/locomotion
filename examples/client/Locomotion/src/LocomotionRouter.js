import React, { useEffect, useRef, useState } from 'react';
import { LogBox } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { PortalProvider } from '@gorhom/portal';
import 'react-native-gesture-handler';
import crashlytics from '@react-native-firebase/crashlytics';
import { NavigationContainer } from '@react-navigation/native';
import i18n from './I18n';
import { MainProvider, RideStateContextContextProvider } from './context';
import MainRouter from './pages';
import RidePopups from './popups/RidePopups';
import { setTopLevelNavigator } from './services/navigation';
import NewRidePageContextProvider from './context/newRideContext';
import BottomSheetContextProvider from './context/bottomSheetContext';
import FutureRidesProvider from './context/futureRides';
import MessagesProvider from './context/messages';
import CancellationReasonsProvider from './context/cancellation-reasons';
import VirtualStationsProvider from './context/virtualStationsContext';

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
            <CancellationReasonsProvider>
              <VirtualStationsProvider>
                <FutureRidesProvider {...props}>
                  <NewRidePageContextProvider {...props}>
                    <MessagesProvider>
                      <PortalProvider>
                        <MainRouter {...props} />
                        {props.children}
                        <RidePopups />
                      </PortalProvider>
                    </MessagesProvider>
                  </NewRidePageContextProvider>
                </FutureRidesProvider>
              </VirtualStationsProvider>
            </CancellationReasonsProvider>
          </RideStateContextContextProvider>
        </BottomSheetContextProvider>
      </MainProvider>
    </NavigationContainer>
  );
};
