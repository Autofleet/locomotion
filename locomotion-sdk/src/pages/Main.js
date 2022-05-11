import React from 'react';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerContentComponent, DrawerLabel } from '../Components/Drawer';
import ActiveRide from './ActiveRide';
import RideHistory from './RideHistory';
import Payments from './Payments';
import Onboarding from './Onboarding';
import ContactUs from './ContactUs';
import i18n from '../I18n';
import Auth from '../services/auth';

const CarIconSource = require('../assets/menuItems/car.png');
const HelpIconSource = require('../assets/menuItems/help.png');
const CreaditCardIconSource = require('../assets/menuItems/creditcard.png');
const PplIconSource = require('../assets/menuItems/person.png');
const HomeIconSource = require('../assets/menuItems/home.png');
const LogoutIconSource = require('../assets/menuItems/logout.png');

const Drawer = createDrawerNavigator();

export default function Main() {
  return (
      <Drawer.Navigator
        initialRouteName="Home" 
        drawerContent={(props)=> (<DrawerContentComponent {...props} />)}
        screenOptions={{
            inactiveBackgroundColor: '#ffffff',
            activeBackgroundColor: '#ffffff',
            headerShown: false,
            drawerActiveTintColor: '#ffffff',
            drawerStyle: {
              width: '100%'
            }
          }}>
        <Drawer.Screen name="Home" component={ActiveRide} options={{drawerLabel: () => (<DrawerLabel title={i18n.t('menu.home')} icon={HomeIconSource} />)}} />
        <Drawer.Screen name="RideHistory" component={RideHistory} options={{drawerLabel: () => (<DrawerLabel title={i18n.t('menu.trips')} icon={CarIconSource} />)}} />
        <Drawer.Screen name="Payment" component={Payments} options={{drawerLabel: () => (<DrawerLabel title={i18n.t('menu.paymentsSettings')} icon={CreaditCardIconSource} />)}} />
        <Drawer.Screen name="Account" component={Onboarding} options={{drawerLabel: () => (<DrawerLabel title={i18n.t('menu.account')} icon={PplIconSource} />)}} />
        <Drawer.Screen name="ContactUs" component={ContactUs} options={{drawerLabel: () => (<DrawerLabel title={i18n.t('menu.support')} icon={HelpIconSource} />)}} />
        <Drawer.Screen name="Logout" component={(({ navigation }) => {
                Auth.logout(navigation);
                return (<View />);
        })} options={{drawerLabel: () => (<DrawerLabel title={i18n.t('menu.logout')} icon={LogoutIconSource} />)}} />
      </Drawer.Navigator>
  );
}