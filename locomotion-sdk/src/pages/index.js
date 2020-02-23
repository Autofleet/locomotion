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
import Lock from './Lock';


export const MainRouter = (props) => {
  const addPageProps = (Page) => (navigationProps) => (<Page {...navigationProps} {...props} />);

  const AppStack = createDrawerNavigator({
    Home: {
      screen: addPageProps(ActiveRide),
      navigationOptions: {
        drawerLabel: 'Home',
      },
    },
    ContactUs: {
      screen: addPageProps(ContactUs),
      navigationOptions: {
        drawerLabel: 'Contact us',
      },
    },
    Logout: {
      screen: (({ navigation }) => {
        Auth.logout(navigation);
        return (<View />);
      }),
      navigationOptions: {
        drawerLabel: 'Logout',
      },
    },

  }, {
  });

  const AuthStack = createStackNavigator({ SignIn: addPageProps(Login), Onboarding: addPageProps(Onboarding) }, {
    headerMode: 'none',
  });

  const Router = createAppContainer(createSwitchNavigator(
    {
      AuthLoading: addPageProps(AuthLoadingScreen),
      App: AppStack,
      Auth: AuthStack,
      Lock
    },
    {
      initialRouteName: 'AuthLoading',
      headerMode: 'none',
    },
  ));



  return (<Router screenProps={{...props}} />);
}



export default MainRouter;
