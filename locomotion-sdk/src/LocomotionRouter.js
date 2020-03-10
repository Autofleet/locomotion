import React from 'react';
import params from 'react-native-config';

import { MainProvider } from './context/main';
// import StorybookUI from './storybook';
import Router, { MainRouter } from './pages';
import NavigationService from './services/navigation';
// import Firebase from './src/services/firebase';

import RidePopups from './popups/RidePopups';
import SettingsContext from './context/settings'

export default props => (
  <MainProvider {...props}>
    <SettingsContext.Provider>
      <MainRouter
        ref={navigation => NavigationService.setTopLevelNavigator(navigation)}
        {...props}
        />
      {props.children}
      {/* Popups */}
      <RidePopups />
      </SettingsContext.Provider>
  </MainProvider>
);
