import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './Main';
import Auth from './Auth';

const Stack = createNativeStackNavigator();

function MainRouter() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='AuthScreens' screenOptions={{ headerShown: false}}>
        <Stack.Screen name="AuthScreens" component={Auth} />
        <Stack.Screen name="MainApp" component={Main} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainRouter;