import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES_COMPS } from './routeConsts';
import { APP_ROUTES, MAIN_ROUTES } from './routes';
import Main from './Main';
import AuthLoadingScreen from './AuthScreens/AuthLoadingScreen';

const APP_ROUTES_COMPS = {
  [APP_ROUTES.MAIN_APP]: Main,
  [APP_ROUTES.AUTH_LOADING]: AuthLoadingScreen,
};

const ROUTES: { [key: string]: React.ComponentType<any> } = ROUTES_COMPS;

const Stack = createNativeStackNavigator();

const MainRouter = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'white',
    }}
  >
    <Stack.Navigator initialRouteName={APP_ROUTES.AUTH_LOADING} screenOptions={{ headerShown: false }} id="authStack">
      <Stack.Screen name={APP_ROUTES.AUTH_LOADING} component={APP_ROUTES_COMPS[APP_ROUTES.AUTH_LOADING]} />
      <Stack.Screen name={MAIN_ROUTES.START} component={ROUTES[MAIN_ROUTES.START]} />
      <Stack.Screen name={MAIN_ROUTES.WELCOME} component={ROUTES[MAIN_ROUTES.WELCOME]} />
      <Stack.Screen name={MAIN_ROUTES.LOCK} component={ROUTES[MAIN_ROUTES.LOCK]} />
      <Stack.Screen name={MAIN_ROUTES.EMAIL_CODE} component={ROUTES[MAIN_ROUTES.EMAIL_CODE]} />
      <Stack.Screen name={MAIN_ROUTES.PHONE} component={ROUTES[MAIN_ROUTES.PHONE]} />
      <Stack.Screen name={MAIN_ROUTES.CODE} component={ROUTES[MAIN_ROUTES.CODE]} />
      <Stack.Screen name={MAIN_ROUTES.NAME} component={ROUTES[MAIN_ROUTES.NAME]} />
      <Stack.Screen name={MAIN_ROUTES.AVATAR} component={ROUTES[MAIN_ROUTES.AVATAR]} />
      <Stack.Screen name={MAIN_ROUTES.ADD_CARD} component={ROUTES[MAIN_ROUTES.ADD_CARD]} />
      <Stack.Screen name={MAIN_ROUTES.PROMO_CODE} component={ROUTES[MAIN_ROUTES.PROMO_CODE]} />
      <Stack.Screen name={MAIN_ROUTES.DEV_SETTINGS_PAGE} component={ROUTES[MAIN_ROUTES.DEV_SETTINGS_PAGE]} />
      <Stack.Screen name={MAIN_ROUTES.EMAIL} component={ROUTES[MAIN_ROUTES.EMAIL]} />
      <Stack.Screen name={APP_ROUTES.MAIN_APP} component={APP_ROUTES_COMPS[APP_ROUTES.MAIN_APP]} />
      <Stack.Screen name={MAIN_ROUTES.POST_RIDE} component={ROUTES[MAIN_ROUTES.POST_RIDE]} />
      <Stack.Screen name={MAIN_ROUTES.MESSAGE_VIEW} component={ROUTES[MAIN_ROUTES.MESSAGE_VIEW]} />
      <Stack.Screen name={MAIN_ROUTES.FUTURE_RIDES} component={ROUTES[MAIN_ROUTES.FUTURE_RIDES]} />
      <Stack.Screen name={MAIN_ROUTES.RIDE_PRICE_BREAKDOWN} component={ROUTES[MAIN_ROUTES.RIDE_PRICE_BREAKDOWN]} />
    </Stack.Navigator>
  </View>
);

export default MainRouter;
