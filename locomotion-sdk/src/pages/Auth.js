import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./Login"
import Onboarding from "./Onboarding"
import Lock from './Lock';
import AddCard from "./AddCard";

const Stack = createNativeStackNavigator();

const AuthScreens = () => {
    return (
        <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="AddCard" component={AddCard} />
            <Stack.Screen name="Lock" component={Lock} />
        </Stack.Navigator>
    )
}

export default AuthScreens;
