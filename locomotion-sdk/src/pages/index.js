import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './Main';
import Auth from './Auth';
import AuthLoadingScreen from './Login/AuthLoadingScreen';
import OnboardingContext from '../context/onboarding'

const Stack = createNativeStackNavigator();

function MainRouter() {
  return (
    <NavigationContainer>
    <OnboardingContext.Provider>
        <Stack.Navigator initialRouteName='AuthLoading' screenOptions={{ headerShown: false}} id='authStack'>
          <Stack.Screen name="AuthScreens" component={Auth} options={{ gestureEnabled: false }} />
          <Stack.Screen name="MainApp" component={Main} /> 
          <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} /> 
        </Stack.Navigator>
    </OnboardingContext.Provider>
    </NavigationContainer>
  );
}

export default MainRouter;