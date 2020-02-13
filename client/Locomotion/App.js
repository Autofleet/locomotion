import React from 'react';
import { LocomotionRouter } from '@autofleet/locomotion-sdk';
import LoginPage from './src/_pages/Login';

const App = () => (
  <LocomotionRouter
    LoginPage={LoginPage}
  />
);

export default App;
