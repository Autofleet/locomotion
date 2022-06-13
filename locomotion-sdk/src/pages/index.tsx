import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES_COMPS } from './routeConsts';
import { APP_ROUTES, MAIN_ROUTES } from './routes';
import Main from './Main';
import AuthLoadingScreen from './AuthScreens/AuthLoadingScreen';

const APP_ROUTES_COMPS = {
  [APP_ROUTES.MAIN_APP]: Main,
  [APP_ROUTES.AUTH_LOADING]: AuthLoadingScreen,
};

const Stack = createNativeStackNavigator();

const MainRouter = () => (
  <Stack.Navigator initialRouteName={APP_ROUTES.AUTH_LOADING} screenOptions={{ headerShown: false }} id="authStack">
    <Stack.Screen name={APP_ROUTES.AUTH_LOADING} component={APP_ROUTES_COMPS[APP_ROUTES.AUTH_LOADING]} />
    <Stack.Screen name={MAIN_ROUTES.START} component={ROUTES_COMPS[MAIN_ROUTES.START]} />
    <Stack.Screen name={MAIN_ROUTES.WELCOME} component={ROUTES_COMPS[MAIN_ROUTES.WELCOME]} />
    <Stack.Screen name={MAIN_ROUTES.LOCK} component={ROUTES_COMPS[MAIN_ROUTES.LOCK]} />
    <Stack.Screen name={MAIN_ROUTES.PHONE} component={ROUTES_COMPS[MAIN_ROUTES.PHONE]} />
    <Stack.Screen name={MAIN_ROUTES.CODE} component={ROUTES_COMPS[MAIN_ROUTES.CODE]} />
    <Stack.Screen name={MAIN_ROUTES.NAME} component={ROUTES_COMPS[MAIN_ROUTES.NAME]} />
    <Stack.Screen name={MAIN_ROUTES.AVATAR} component={ROUTES_COMPS[MAIN_ROUTES.AVATAR]} />
    <Stack.Screen name={MAIN_ROUTES.ADD_CARD} component={ROUTES_COMPS[MAIN_ROUTES.ADD_CARD]} />
    <Stack.Screen name={MAIN_ROUTES.EMAIL} component={ROUTES_COMPS[MAIN_ROUTES.EMAIL]} />
    <Stack.Screen name={APP_ROUTES.MAIN_APP} component={APP_ROUTES_COMPS[APP_ROUTES.MAIN_APP]} />
  </Stack.Navigator>
);

export default MainRouter;
