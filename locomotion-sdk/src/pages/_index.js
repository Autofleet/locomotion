import React, { useRef, useEffect, useState } from 'react';
import { Dimensions, View, Text } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createSwitchNavigator } from '@react-navigation/compat';
import i18n from '../I18n';
import NavigationService from '../services/navigation';
import AuthLoadingScreen from './Login/AuthLoadingScreen';
import Auth from '../services/auth';
import Login from './Login';

import ActiveRide from './ActiveRide';
import RideHistory from './RideHistory';
import ContactUs from './ContactUs';
import Onboarding, { needOnboarding } from './Onboarding';
import Lock from './Lock';
import Logout from './Logout';
import Payments from './Payments';
import { DrawerContentComponent, DrawerLabel, Icon } from '../Components/Drawer';
import AppSettings from '../services/app-settings';
import {useStateValue} from '../context/main';
import network from '../services/network';

const PlusIconSource = require('../assets/plus.png');
const CarIconSource = require('../assets/menuItems/car.png');
const HelpIconSource = require('../assets/menuItems/help.png');
const CreaditCardIconSource = require('../assets/menuItems/creditcard.png');
const PplIconSource = require('../assets/menuItems/person.png');
const HomeIconSource = require('../assets/menuItems/home.png');
const LogoutIconSource = require('../assets/menuItems/logout.png');

const drawerWidth = Dimensions.get('window').width / 1.25;
const activeBackgroundColor = '#ffffff';
const inactiveBackgroundColor = '#ffffff';

const screensOptions = {
  Home: {
    screen: ActiveRide,
    title: i18n.t('menu.home'),
    icon: HomeIconSource
  },
  RideHistory: {
    screen: RideHistory,
    title: i18n.t('menu.trips'),
    icon: CarIconSource
  },
  Account: {
    screen: Onboarding,
    title: i18n.t('menu.account'),
    icon: PplIconSource
  },
  Payments: {
    screen: Payments,
    title: i18n.t('menu.paymentsSettings'),
    icon: CreaditCardIconSource
  },
  ContactUs: {
    screen: ContactUs,
    title: i18n.t('menu.support'),
    icon: HelpIconSource
  },
  Logout: {
    screen: Logout,
    title: i18n.t('menu.logout'),
    icon: LogoutIconSource
  },
/*   AuthLoading: {
    screen: AuthLoadingScreen,
    title: () => null,
    icon: null,
    hide: true
  }, */


}
export const MainRouter = (props) => {
  const [appState, dispatch] = useStateValue();
  const [p, setP] = useState(null)
  useEffect(() => {
    console.log('ssssss', p);
  }, [p])

  useEffect(() => {
    console.log('ssappStateappStatessss', appState);
  }, [appState])

  const init = () => {
    console.log(`INIT`,appState);

    async function getFromStorage() {
      console.log(`IN GETT`);
      const payload = await AppSettings.getSettings();

      await dispatch({
        type: 'changeState',
        payload,
      });

      let page = payload.userProfile ? 'Home' : 'Auth';

      if (payload.userProfile) {
        const response = await network.get('api/v1/me');
        if (!response || response.data === null) {
          Auth.logout(navigation);
        }

        const userData = response.data
        const userProfile = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatar: userData.avatar,
          email: userData.email,
          pushToken: userData.pushToken,
          pushUserId: userData.pushUserId,
        };

        AppSettings.update({ userProfile });

        if (!userData.active) {
          page = 'Lock';
        }

        if (needOnboarding(userProfile)) {
          page = 'Onboarding';
        }
      }
      console.log(`PPPP`, page);

      setP(page)
     // navigation.navigate(page, { showHeaderIcon: false });
    }
    if (!appState || !appState.userProfile) { // Load app state
      console.log(`XXXXX`);

      getFromStorage();
    }
  };
  //useEffect(init, []);


  const navigatorRef = useRef(null);

  const addPageProps = Page => (navigationProps = {}) => (<Page {...navigationProps} />);
  const DrawerNavigator = createDrawerNavigator();

  const Drawer = ({initialRouteName = "Home"}) => (
    <DrawerNavigator.Navigator
      initialRouteName="Home"
      /* drawerContent={(props) => <DrawerContentComponent
        {...props}
        screensOptions={screensOptions}
        inactiveBackgroundColor="#ffffff"
        activeBackgroundColor="#ffffff"
        itemStyle={{
          borderColor: '#dfdfdf',
          borderBottomWidth: 1,
        }}
        />}
        drawerStyle={{
          width: drawerWidth
        }}
        detachInactiveScreens={false}
        drawerType="front"
        unmountOnBlur={false} */
    >
      {Object.keys(screensOptions).map(k => {
        return (
          <DrawerNavigator.Screen
            name={k}
            component={addPageProps(screensOptions[k].screen)}
            initialParams={{hide:screensOptions[k].hide}}
            navigationOptions={({navigation}) => {
              return {
                  drawerLabel: () => null,
              }
            }}
            options={{
            // drawerLabel: () => (<View><Text>xxxxxx</Text><Arrow /></View>),//screensOptions[k].title,
            drawerLabel: screensOptions[k].title,
              drawerIcon: () => (<Icon icon={screensOptions[k].icon} />),
            }}
          />
        )
      })}
    </DrawerNavigator.Navigator>
  );

  const AppStack = createDrawerNavigator();
  const AuthStackNavigator = () => (

    <AppStack.Navigator
      screenOptions={{
        screenOrientation: 'portrait_up',
        stackAnimation: 'none',
        headerStyle: {
          backgroundColor: 'rgba(246, 246, 248, 1)',
          boxShadow: null,
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
          marginBottom: 0,
          borderBottomWidth: 1,
          borderColor: 'rgba(0,0,0,.1)',
        },
        headerTitleStyle: {
          fontFamily: 'Montserrat-Regular',
          fontWeight: 'normal',
        },
        headerBackTitle: i18n.t('navigation.back'),
      }}
    >
      <AppStack.Screen name="SignIn" component={addPageProps(Login)} options={{ headerShown: false }} />
      <AppStack.Screen name="Onboarding" component={addPageProps(Onboarding)} options={{ headerShown: false }} />
    </AppStack.Navigator>
  );


  const MainStack = createNativeStackNavigator();
  const MainStackNavigator = ({initialRouteName = "Home"}) => {
    console.log('IN MainStackNavigator', initialRouteName);
    return (
    <MainStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        screenOrientation: 'portrait_up',
        stackAnimation: 'none',
        headerStyle: {
          backgroundColor: 'rgba(246, 246, 248, 1)',
          boxShadow: null,
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
          marginBottom: 0,
          borderBottomWidth: 1,
          borderColor: 'rgba(0,0,0,.1)',
        },
        headerTitleStyle: {
          fontFamily: 'Montserrat-Regular',
          fontWeight: 'normal',
        },
        headerBackTitle: i18n.t('navigation.back'),
      }}
    >
      <MainStack.Screen name="AuthLoading" component={addPageProps(AuthLoadingScreen)} options={{ headerShown: false }} />
      <MainStack.Screen name="Auth" component={addPageProps(AuthStackNavigator)} options={{ headerShown: false }} />
      <MainStack.Screen name="Onboarding" component={addPageProps(Onboarding)} options={{ headerShown: false }} />
      <MainStack.Screen name="Lock" component={addPageProps(Lock)} options={{ headerShown: false }} />
    </MainStack.Navigator>
  );
    }


   const TopLevelNavigator = createSwitchNavigator(
    {
      AuthLoading: addPageProps(AuthLoadingScreen),
      App: Drawer,
      Auth: AuthStackNavigator,
      Lock,
      Onboarding,
    },
    {
      initialRouteName: 'AuthLoading',
      navigationOptions: {
        stackAnimation: 'none',
      },
      resetOnBlur: false
    },
  );

  return (
    <NavigationContainer
      ref={navigatorRef}
      onReady={() => {
        if (navigatorRef) {
          NavigationService.setTopLevelNavigator(navigatorRef.current);
        }
      }}
    >

     <TopLevelNavigator></TopLevelNavigator>
    </NavigationContainer>
  );
};


export default MainRouter;
