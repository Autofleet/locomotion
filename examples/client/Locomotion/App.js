import React from 'react';
import {LocomotionRouter} from '@autofleet/locomotion-sdk';
// import de from './src/I18n/en.json';

const App = () => {
  return (
    <LocomotionRouter
      /*     i18n={{default: 'de', translations: [{lang:'de', translation:de}]}} */
      menuSide="left"
      /* mapSettings={{
          customMapStyle: [{
            featureType: 'poi',
            stylers: [{ visibility: 'off' }],
          }],
        }} */
    />
  );
};

export default App;
