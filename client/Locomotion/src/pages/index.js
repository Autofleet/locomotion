import React from 'react';
import { View } from 'react-native';
import {
  createSwitchNavigator, createStackNavigator, createAppContainer, createDrawerNavigator,
} from 'react-navigation';

import AuthLoadingScreen from './Login/AuthLoadingScreen';
import Auth from '../services/auth';
import Login from './Login';

import ActiveRide from './ActiveRide';
import ContactUs from './ContactUs';
import Onboarding from './Onboarding';

const AppStack = createDrawerNavigator({
  Home: {
    screen: ActiveRide,
    navigationOptions: {
      drawerLabel: 'Home',
    },
  },
  ContactUs: {
    screen: ContactUs,
    navigationOptions: {
      drawerLabel: 'Contact us',
    },
  },
  Logout: {
    screen: (({ navigation }) => {
      console.log('Auth.logout', Auth.logout);
      Auth.logout(navigation);
      return (<View />);
    }),
    navigationOptions: {
      drawerLabel: 'Logout',
    },
  },

}, {
});

const AuthStack = createStackNavigator({ SignIn: Login, Onboarding }, {
  headerMode: 'none',
});

const Router = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
    headerMode: 'none',
  },
));

export default Router;
