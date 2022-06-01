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
import { ONBOARDING_PAGE_NAMES } from './routes';

const Stack = createNativeStackNavigator();

const AuthScreens = () => (
  <Stack.Navigator initialRouteName={ONBOARDING_PAGE_NAMES.START} screenOptions={{ headerShown: false, gestureEnabled: false, animation: 'slide_from_left' }}>
    <Stack.Screen name={ONBOARDING_PAGE_NAMES.START} component={StartScreen} />
    <Stack.Screen name={ONBOARDING_PAGE_NAMES.PHONE} component={Phone} />
    <Stack.Screen name={ONBOARDING_PAGE_NAMES.CODE} component={Code} />
    <Stack.Screen name={ONBOARDING_PAGE_NAMES.NAME} component={Name} />
    <Stack.Screen name={ONBOARDING_PAGE_NAMES.CARD} component={Card} />
    <Stack.Screen name={ONBOARDING_PAGE_NAMES.AVATAR} component={Avatar} />
    <Stack.Screen name={ONBOARDING_PAGE_NAMES.EMAIL} component={Email} />
    <Stack.Screen name={ONBOARDING_PAGE_NAMES.WELCOME} component={Welcome} />
    <Stack.Screen name={ONBOARDING_PAGE_NAMES.LOCK} component={Lock} />
  </Stack.Navigator>
);

export default AuthScreens;
