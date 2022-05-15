import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Lock from './Lock';
import StartScreen from './AuthScreens/StartScreen';
import Phone from './AuthScreens/Onboarding/Phone';
import Code from './AuthScreens/Onboarding/Code';
import Name from './AuthScreens/Onboarding/Name';
import Welcome from './AuthScreens/Onboarding/Welcome';

const Stack = createNativeStackNavigator();

const AuthScreens = () => {
    return (
            <Stack.Navigator initialRouteName='Start' screenOptions={{ headerShown: false, gestureEnabled: false }}>
                <Stack.Screen name="Start" component={StartScreen} />
                <Stack.Screen name="Phone" component={Phone} />
                <Stack.Screen name="Code" component={Code} />
                <Stack.Screen name="Name" component={Name} />
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="Lock" component={Lock} />  
            </Stack.Navigator>
    )
}

export default AuthScreens;