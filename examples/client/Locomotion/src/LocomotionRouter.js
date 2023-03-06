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
import GenericErrorPopup from './popups/GenericError';
import networkInfo from './services/networkInfo';

LogBox.ignoreAllLogs();

export default (props) => {
  const navigatorRef = useRef(null);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    crashlytics().log('App mounted.');
    enableScreens(false);
    let unsubscribeFunction;
    setTimeout(() => {
      unsubscribeFunction = networkInfo.addEventListener((listener) => {
        setIsConnected(listener.isConnected && listener.isInternetReachable);
      });
    }, 3000);

    return () => {
      if (unsubscribeFunction) {
        unsubscribeFunction();
      }
    };
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
                        <GenericErrorPopup
                          isVisible={!isConnected}
                          title={i18n.t('popups.noConnection.title')}
                          text={i18n.t('popups.noConnection.text')}
                          buttonText={i18n.t('popups.noConnection.buttonText')}
                          closePopup={() => {
                            setIsConnected(true);
                          }}
                        />
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
