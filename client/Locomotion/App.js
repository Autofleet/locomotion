import React from 'react';
import { LocomotionRouter } from '@autofleet/locomotion-sdk';
const Logo = require('./src/assets/logo.png');

const App = () => (
  <LocomotionRouter
    logo={Logo}
  />
);

export default App;
