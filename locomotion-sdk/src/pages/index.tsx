import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './Main';
import Auth from './Auth';
import AuthLoadingScreen from './AuthScreens/AuthLoadingScreen';

const Stack = createNativeStackNavigator();

const MainRouter = () => (
  <Stack.Navigator initialRouteName="AuthLoading" screenOptions={{ headerShown: false }} id="authStack">
    <Stack.Screen name="AuthScreens" component={Auth} options={{ gestureEnabled: false }} />
    <Stack.Screen name="MainApp" component={Main} />
    <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
  </Stack.Navigator>
);

export default MainRouter;
