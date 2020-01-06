import React from 'react';
import params from 'react-native-config';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';

import { MainProvider } from './src/context/main';
import StorybookUI from './storybook';
import Router from './src/pages';
import NavigationService from './src/services/navigation';

import RidePopups from './src/popups/RidePopups';

const App = () => (
  <ApplicationProvider mapping={mapping} theme={lightTheme}>
    <MainProvider>
      <Router ref={navigation => NavigationService.setTopLevelNavigator(navigation)} />

      {/* Popups */}
      <RidePopups />
    </MainProvider>
  </ApplicationProvider>
);

export default params.RUN_STORYBOOK ? StorybookUI : App;
