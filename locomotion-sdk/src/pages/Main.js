import React, { useContext } from 'react';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentComponent, DrawerLabel } from '../Components/Menu';
import { Context as ThemeContext } from '../context/theme';
import Auth from '../services/auth';
import { ROUTES_COMPS } from './consts';
import { ROUTES } from './routes';
import { UserContext } from '../context/user';
import { INITIAL_USER_STATE } from './AuthScreens/AuthLoadingScreen';

const Drawer = createDrawerNavigator();

const Main = () => {
  const theme = useContext(ThemeContext);
  const { setUser } = useContext(UserContext);
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
      <Drawer.Screen name={ROUTES.HOME} component={ROUTES_COMPS[ROUTES.HOME]} />
      <Drawer.Screen name={ROUTES.RIDE_HISTORY} component={ROUTES_COMPS[ROUTES.RIDE_HISTORY]} />
      <Drawer.Screen name={ROUTES.PAYMENT} component={ROUTES_COMPS[ROUTES.PAYMENT]} />
      <Drawer.Screen name={ROUTES.ACCOUNT} component={ROUTES_COMPS[ROUTES.ACCOUNT]} />
      <Drawer.Screen name={ROUTES.CONTACT_US} component={ROUTES_COMPS[ROUTES.CONTACT_US]} />
      <Drawer.Screen name={ROUTES.WEBVIEW} component={ROUTES_COMPS[ROUTES.WEBVIEW]} />
      <Drawer.Screen
        name={ROUTES.LOGOUT}
        component={(({ navigation }) => {
          setUser(INITIAL_USER_STATE);
          Auth.logout(navigation);
          return (<View />);
        })}
      />
    </Drawer.Navigator>
  );
};

export default Main;
