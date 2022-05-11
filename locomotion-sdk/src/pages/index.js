import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './Main';
import Auth from './Auth';
import AuthLoadingScreen from './Login/AuthLoadingScreen';

const Stack = createNativeStackNavigator();

function MainRouter() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='AuthLoading' screenOptions={{ headerShown: false}}>
        <Stack.Screen name="AuthScreens" component={Auth} />
        <Stack.Screen name="MainApp" component={Main} /> 
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainRouter;