import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerContentComponent, DrawerLabel } from '../Components/Menu';
import { Context as ThemeContext } from '../context/theme';
import { ROUTES_COMPS } from './routeConsts';
import { MAIN_ROUTES } from './routes';

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

const InnerHome = () => {
  const theme = useContext(ThemeContext);

  return (
    <Drawer.Navigator
      initialRouteName="innerHome"
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
        name="innerHome"
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
        name={MAIN_ROUTES.CARD_DETAILS}
        component={ROUTES_COMPS[MAIN_ROUTES.CARD_DETAILS]}
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
  );
};

const Main = () => (
  <Stack.Navigator
    initialRouteName={MAIN_ROUTES.HOME}
    screenOptions={{
      inactiveBackgroundColor: '#ffffff',
      activeBackgroundColor: '#ffffff',
      headerShown: false,
    }}
  >
    <Stack.Screen
      name={MAIN_ROUTES.HOME}
      component={InnerHome}
    />
    <Stack.Screen
      name={MAIN_ROUTES.COMPLETED_RIDE_OVERVIEW_PAGE}
      component={ROUTES_COMPS[MAIN_ROUTES.COMPLETED_RIDE_OVERVIEW_PAGE]}
    />
    <Stack.Screen
      name={MAIN_ROUTES.RIDE_HISTORY}
      component={ROUTES_COMPS[MAIN_ROUTES.RIDE_HISTORY]}
    />
    <Stack.Screen
      name={MAIN_ROUTES.PAYMENT}
      component={ROUTES_COMPS[MAIN_ROUTES.PAYMENT]}
    />
    <Stack.Screen
      name={MAIN_ROUTES.ACCOUNT}
      component={ROUTES_COMPS[MAIN_ROUTES.ACCOUNT]}
    />
    <Stack.Screen
      name={MAIN_ROUTES.CONTACT_US}
      component={ROUTES_COMPS[MAIN_ROUTES.CONTACT_US]}
    />
    <Stack.Screen
      name={MAIN_ROUTES.WEBVIEW}
      component={ROUTES_COMPS[MAIN_ROUTES.WEBVIEW]}
    />
    <Stack.Screen
      name={MAIN_ROUTES.POST_RIDE}
      component={ROUTES_COMPS[MAIN_ROUTES.POST_RIDE]}
    />
    <Stack.Screen
      name={MAIN_ROUTES.LOGOUT}
      component={ROUTES_COMPS[MAIN_ROUTES.LOGOUT]}
    />
  </Stack.Navigator>
);

export default Main;
