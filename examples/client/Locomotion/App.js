import React from 'react';
import { LogBox } from 'react-native';
import LocomotionRouter from './src/LocomotionRouter';
// import de from './src/I18n/en.json';
LogBox.ignoreAllLogs();

const App = () => (
  <LocomotionRouter
    /*     i18n={{default: 'de', translations: [{lang:'de', translation:de}]}} */
    menuSide="right"
    /* mapSettings={{
      customMapStyle: [{
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
      }],
    }} */
  />
);

export default App;
