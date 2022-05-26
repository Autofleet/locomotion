import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Lock from './Lock';
import StartScreen from './AuthScreens/StartScreen';
import Phone from './AuthScreens/Onboarding/Phone';
import Code from './AuthScreens/Onboarding/Code';
import Name from './AuthScreens/Onboarding/Name';
import Welcome from './AuthScreens/Onboarding/Welcome';
import Avatar from './AuthScreens/Onboarding/Avatar';
import Email from './AuthScreens/Onboarding/Email';
import Card from './AuthScreens/Onboarding/Card';

const Stack = createNativeStackNavigator();

const AuthScreens = () => (
  <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false, gestureEnabled: false, animation: 'slide_from_left' }}>
    <Stack.Screen name="Start" component={StartScreen} />
    <Stack.Screen name="Phone" component={Phone} />
    <Stack.Screen name="Code" component={Code} />
    <Stack.Screen name="Name" component={Name} />
    <Stack.Screen name="AddCard" component={Card} />
    <Stack.Screen name="Avatar" component={Avatar} />
    <Stack.Screen name="Email" component={Email} />
    <Stack.Screen name="Welcome" component={Welcome} />
    <Stack.Screen name="Lock" component={Lock} />
  </Stack.Navigator>
);

export default AuthScreens;
