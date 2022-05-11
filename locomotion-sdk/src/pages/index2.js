import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './Main';

const Stack = createNativeStackNavigator();

function MainRouter() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='MainApp' screenOptions={{ headerShown: false}}>
        <Stack.Screen name="AuthScreens" component={() => (<></>)} />
        <Stack.Screen name="MainApp" component={Main} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainRouter;