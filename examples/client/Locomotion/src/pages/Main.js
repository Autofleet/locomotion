import React, { useContext, useRef, useEffect } from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentComponent, DrawerLabel } from '../Components/Menu';
import { Context as ThemeContext } from '../context/theme';
import { ROUTES_COMPS } from './routeConsts';
import { MAIN_ROUTES } from './routes';
import BottomSheet from '../Components/BottomSheet';
import BottomSheetContextProvider, { BottomSheetContext } from '../context/bottomSheetContext';

const Drawer = createDrawerNavigator();

const Main = () => {
  const theme = useContext(ThemeContext);
  const { childrenState, bottomSheetRef } = useContext(BottomSheetContext);
  return (
    <>
      <Drawer.Navigator
        initialRouteName={MAIN_ROUTES.POST_RIDE}
        drawerContent={props => (<DrawerContentComponent {...props} />)}
        screenOptions={{
          inactiveBackgroundColor: '#ffffff',
          activeBackgroundColor: '#ffffff',
          headerShown: false,
          drawerStyle: {
            width: '80%',
            margin: 0,
            backgroundColor: theme.pageBackgroundColor,
          },
          drawerType: 'front',
        }}
      >
        <Drawer.Screen
          name={MAIN_ROUTES.HOME}
          component={ROUTES_COMPS[MAIN_ROUTES.HOME]}
        />
        <Drawer.Screen
          name={MAIN_ROUTES.COMPLETED_RIDE_OVERVIEW_PAGE}
          component={ROUTES_COMPS[MAIN_ROUTES.COMPLETED_RIDE_OVERVIEW_PAGE]}
        />
        <Drawer.Screen
          name={MAIN_ROUTES.RIDE_HISTORY}
          component={ROUTES_COMPS[MAIN_ROUTES.RIDE_HISTORY]}
        />
        <Drawer.Screen
          name={MAIN_ROUTES.PAYMENT}
          component={ROUTES_COMPS[MAIN_ROUTES.PAYMENT]}
        />
        <Drawer.Screen
          name={MAIN_ROUTES.ACCOUNT}
          component={ROUTES_COMPS[MAIN_ROUTES.ACCOUNT]}
        />
        <Drawer.Screen
          name={MAIN_ROUTES.CONTACT_US}
          component={ROUTES_COMPS[MAIN_ROUTES.CONTACT_US]}
        />
        <Drawer.Screen
          name={MAIN_ROUTES.WEBVIEW}
          component={ROUTES_COMPS[MAIN_ROUTES.WEBVIEW]}
        />
        <Drawer.Screen
          name={MAIN_ROUTES.POST_RIDE}
          component={ROUTES_COMPS[MAIN_ROUTES.POST_RIDE]}
        />
        <Drawer.Screen
          name={MAIN_ROUTES.LOGOUT}
          component={ROUTES_COMPS[MAIN_ROUTES.LOGOUT]}
        />
      </Drawer.Navigator>
      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose
        index={1}
        childComponent={childrenState}
      />
    </>
  );
};

export default props => (
  <BottomSheetContextProvider {...props}>
    <Main {...props} />
  </BottomSheetContextProvider>
);
