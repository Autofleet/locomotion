import React from 'react';
import LocomotionRouter from './src/LocomotionRouter';
// import de from './src/I18n/en.json';

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
