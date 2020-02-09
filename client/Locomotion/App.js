import React from 'react';
import params from 'react-native-config';

import { MainProvider } from './src/context/main';
import StorybookUI from './storybook';
import Router from './src/pages';
import NavigationService from './src/services/navigation';
import Firebase from './src/services/firebase';

import RidePopups from './src/popups/RidePopups';

const App = () => (
  <MainProvider>
    <Router ref={navigation => NavigationService.setTopLevelNavigator(navigation)} />

    {/* Popups */}
    <RidePopups />
  </MainProvider>
);

export default params.RUN_STORYBOOK ? StorybookUI : App;
