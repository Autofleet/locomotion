import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./Login"
import Onboarding from "./Onboarding"

const Stack = createNativeStackNavigator();

const AuthScreens = () => {
    return (
        <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Onboarding" component={Onboarding} />  
        </Stack.Navigator>
    )
}

export default AuthScreens;