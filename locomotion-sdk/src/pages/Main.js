import React, { useContext } from 'react';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentComponent, DrawerLabel } from '../Components/Drawer';
import { Context as ThemeContext } from '../context/theme';
import Auth from '../services/auth';
import { ROUTES_COMPS } from './consts';
import { ROUTES } from './routes';

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
      <Drawer.Screen name={ROUTES.HOME} component={ROUTES_COMPS.HOME} />
      <Drawer.Screen name={ROUTES.RIDE_HISTORY} component={ROUTES_COMPS.RIDE_HISTORY} />
      <Drawer.Screen name={ROUTES.PAYMENT} component={ROUTES_COMPS.PAYMENT} />
      <Drawer.Screen name={ROUTES.ACCOUNT} component={ROUTES_COMPS.ACCOUNT} />
      <Drawer.Screen name={ROUTES.CONTACT_US} component={ROUTES_COMPS.CONTACT_US} />
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
