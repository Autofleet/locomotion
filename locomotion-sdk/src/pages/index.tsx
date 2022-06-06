import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { profileStack } from './routeConsts';
import { APP_ROUTES } from './routes';
import Auth from './Auth';
import Main from './Main';
import AuthLoadingScreen from './AuthScreens/AuthLoadingScreen';

const APP_ROUTES_COMPS = {
  [APP_ROUTES.AUTH_SCREENS]: Auth,
  [APP_ROUTES.MAIN_APP]: Main,
  [APP_ROUTES.AUTH_LOADING]: AuthLoadingScreen,
};

const Stack = createNativeStackNavigator();

const MainRouter = () => (
  <Stack.Navigator initialRouteName={APP_ROUTES.AUTH_LOADING} screenOptions={{ headerShown: false }} id="authStack">
    <Stack.Screen
      name={APP_ROUTES.AUTH_SCREENS}
      component={APP_ROUTES_COMPS[APP_ROUTES.AUTH_SCREENS]}
      options={{ gestureEnabled: false }}
    />
    <Stack.Screen
      name={APP_ROUTES.MAIN_APP}
      component={APP_ROUTES_COMPS[APP_ROUTES.MAIN_APP]}
    />
    <Stack.Screen
      name={APP_ROUTES.AUTH_LOADING}
      component={APP_ROUTES_COMPS[APP_ROUTES.AUTH_LOADING]}
    />
    {profileStack({ stack: Stack })}
  </Stack.Navigator>
);

export default MainRouter;
