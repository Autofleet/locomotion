import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerContentComponent } from '../Components/Drawer';
import ActiveRide from './ActiveRide';
import RideHistory from './RideHistory';
import Payments from './Payments';
import Onboarding from './Onboarding';
import ContactUs from './ContactUs';
import i18n from '../I18n';
import Auth from '../services/auth';
import { View } from 'react-native';

const Drawer = createDrawerNavigator();

export default function Main() {
  return (
      <Drawer.Navigator
        initialRouteName="RideHistory" 
        drawerContent={(props)=> (<DrawerContentComponent {...props} />)}
        screenOptions={{
            inactiveBackgroundColor: '#ffffff',
            activeBackgroundColor: '#ffffff',
            headerShown: false,
          }}>
        <Drawer.Screen name="Home" component={ActiveRide} options={{title: i18n.t('menu.home')}} />
        <Drawer.Screen name="RideHistory" component={RideHistory} options={{title: i18n.t('menu.trips')}} />
        <Drawer.Screen name="Payment" component={Payments} options={{title: i18n.t('menu.paymentsSettings')}} />
        <Drawer.Screen name="Account" component={Onboarding} options={{title: i18n.t('menu.account')}} />
        <Drawer.Screen name="ContactUs" component={ContactUs} options={{title: i18n.t('menu.support')}} />
        <Drawer.Screen name="Logout" component={(({ navigation }) => {
                Auth.logout(navigation);
                return (<View />);
        })} options={{title: i18n.t('menu.logout')}} />
      </Drawer.Navigator>
  );
}