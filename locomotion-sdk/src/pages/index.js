import React from 'react';
import { Dimensions, View } from 'react-native';
import {
  createSwitchNavigator, createStackNavigator, createAppContainer, createDrawerNavigator,
} from 'react-navigation';
import i18n from '../I18n';

import AuthLoadingScreen from './Login/AuthLoadingScreen';
import Auth from '../services/auth';
import Login from './Login';

import ActiveRide from './ActiveRide';
import RideHistory from './RideHistory';
import ContactUs from './ContactUs';
import Onboarding from './Onboarding';
import Lock from './Lock';
import { DrawerContentComponent, DrawerLabel } from '../Components/Drawer';

const PlusIconSource = require('../assets/plus.png');
const CarIconSource = require('../assets/menuItems/car.png');
const HelpIconSource = require('../assets/menuItems/help.png');
const CreaditCardIconSource = require('../assets/menuItems/creditcard.png');
const PplIconSource = require('../assets/menuItems/person.png');
const HomeIconSource = require('../assets/menuItems/home.png');
const LogoutIconSource = require('../assets/menuItems/logout.png');

const drawerWidth = Dimensions.get('window').width;
const activeBackgroundColor = '#ffffff';
const inactiveBackgroundColor = '#ffffff';

export const MainRouter = (props) => {
  const addPageProps = Page => navigationProps => (<Page {...navigationProps} {...props} />);

  const AppStack = createDrawerNavigator({
    Home: {
      screen: addPageProps(ActiveRide),
      navigationOptions: {
        drawerLabel: (<DrawerLabel title={i18n.t('menu.home')} icon={HomeIconSource} />),
      },
    },
    RideHistory: {
      screen: addPageProps(RideHistory),
      navigationOptions: {
        drawerLabel: (<DrawerLabel title={i18n.t('menu.trips')} icon={CarIconSource} />),
      },
    },
    // Payment: {
    //   screen: addPageProps(ActiveRide),
    //   navigationOptions: {
    //     drawerLabel: (<DrawerLabel title={i18n.t('menu.paymentsSettings')} icon={CreaditCardIconSource} />),
    //   },
    // },
    Account: {
      screen: addPageProps(Onboarding),
      navigationOptions: {
        drawerLabel: (<DrawerLabel title={i18n.t('menu.account')} icon={PplIconSource} />),
      },
    },
    ContactUs: {
      screen: addPageProps(ContactUs),
      navigationOptions: {
        drawerLabel: (<DrawerLabel title={i18n.t('menu.support')} icon={HelpIconSource} />),
      },
    },

    Logout: {
      screen: (({ navigation }) => {
        Auth.logout(navigation);
        return (<View />);
      }),
      navigationOptions: {
        drawerLabel: (<DrawerLabel title={i18n.t('menu.logout')} icon={LogoutIconSource} />),
      },
    },
  }, {
    initialRouteName: 'Home',
    drawerWidth,
    contentComponent: DrawerContentComponent,
    contentOptions: {
      inactiveBackgroundColor: '#ffffff',
      activeBackgroundColor: '#ffffff',
    },
  });

  const AuthStack = createStackNavigator({ SignIn: addPageProps(Login), Onboarding: addPageProps(Onboarding) }, {
    headerMode: 'none',
  });

  const Router = createAppContainer(createSwitchNavigator(
    {
      AuthLoading: addPageProps(AuthLoadingScreen),
      App: AppStack,
      Auth: AuthStack,
      Lock,
      Onboarding,
    },
    {
      initialRouteName: 'AuthLoading',
      headerMode: 'none',
    },
  ));


  return (<Router screenProps={{ ...props }} />);
};


export default MainRouter;
