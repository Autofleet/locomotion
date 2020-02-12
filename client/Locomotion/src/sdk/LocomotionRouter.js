import React from 'react';
import params from 'react-native-config';

import { MainProvider } from './context/main';
// import StorybookUI from './storybook';
import Router, {RealRouter} from './pages';
import NavigationService from './services/navigation';
// import Firebase from './src/services/firebase';

import RidePopups from './popups/RidePopups';

const LocomotionRouter = (props) => {
  console.log('PROPS',props);

  return (
  <MainProvider>
    <RealRouter
    ref={navigation => NavigationService.setTopLevelNavigator(navigation, navigation.props)}
    />
    {props.children}
    {/* Popups */}
    <RidePopups />
  </MainProvider>
);

  }
export default LocomotionRouter;
