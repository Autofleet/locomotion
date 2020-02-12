import React, {Text} from 'react';
//import params from 'react-native-config';
 import {LocomotionRouter} from '@autofleet/locomotion-sdk'
//import {LocomotionRouter} from './src/sdk'
//import { MainProvider } from './src/context/main';
//import StorybookUI from './storybook';
//import Router from './src/pages';
//import NavigationService from './src/services/navigation';
//import Firebase from './src/services/firebase';

//import RidePopups from './src/popups/RidePopups';
import LoginPage from './src/pages/Login'

const App = () => (
  <LocomotionRouter
  LoginPage={LoginPage}
  >

  </LocomotionRouter>
);

export default App;
