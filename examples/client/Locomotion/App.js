import React from 'react';
import { LocomotionRouter } from '@autofleet/locomotion-sdk';
import en from './src/I18n/en.json';

const App = () => (
  <LocomotionRouter
    i18n={{default: 'en', translations: [{lang:'en', translation:en}]}}
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
