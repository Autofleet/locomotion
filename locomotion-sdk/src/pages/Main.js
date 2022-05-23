import React, { useContext } from 'react';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentComponent, DrawerLabel } from '../Components/Drawer';
import { Context as ThemeContext } from '../context/theme';
import ActiveRide from './ActiveRide';
import RideHistory from './RideHistory';
import Payments from './Payments';
import Onboarding from './Onboarding';
import ContactUs from './ContactUs';
import Auth from '../services/auth';
import { ROUTES } from './consts';

const Drawer = createDrawerNavigator();

const Main = () => {
  const theme = useContext(ThemeContext);
  return (
    <Drawer.Navigator
      initialRouteName={ROUTES.HOME}
      drawerContent={props => (<DrawerContentComponent {...props} />)}
      screenOptions={{
        inactiveBackgroundColor: '#ffffff',
        activeBackgroundColor: '#ffffff',
        headerShown: false,
        drawerStyle: {
          width: '80%',
          margin: 0,
          backgroundColor: theme.pageBackgroundColor,
        },
      }}
    >
      <Drawer.Screen name={ROUTES.HOME} component={ActiveRide} />
      <Drawer.Screen name={ROUTES.RIDE_HISTORY} component={RideHistory} />
      <Drawer.Screen name={ROUTES.PAYMENT} component={Payments} />
      <Drawer.Screen name={ROUTES.ACCOUNT} component={Onboarding} />
      <Drawer.Screen name={ROUTES.CONTACT_US} component={ContactUs} />
      <Drawer.Screen
        name={ROUTES.LOGOUT}
        component={(({ navigation }) => {
          Auth.logout(navigation);
          return (<View />);
        })}
      />
    </Drawer.Navigator>
  );
};

export default Main;
