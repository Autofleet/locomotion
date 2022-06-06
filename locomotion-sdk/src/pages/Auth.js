import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AUTH_ROUTES_COMPS, profileStack } from './routeConsts';
import { AUTH_ROUTES } from './routes';

const Stack = createNativeStackNavigator();

const AuthScreens = () => (
  <Stack.Navigator initialRouteName={AUTH_ROUTES.START} screenOptions={{ headerShown: false, gestureEnabled: false, animation: 'slide_from_left' }}>
    <Stack.Screen name={AUTH_ROUTES.START} component={AUTH_ROUTES_COMPS[AUTH_ROUTES.START]} />
  </Stack.Navigator>
);

export default AuthScreens;
