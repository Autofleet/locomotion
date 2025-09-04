import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LocomotionRouter from './src/LocomotionRouter';
// import de from './src/I18n/en.json';

const App = () => (
  <SafeAreaProvider>
    <StatusBar translucent={false} barStyle="dark-content" />
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>

      <LocomotionRouter
    /*     i18n={{default: 'de', translations: [{lang:'de', translation:de}]}} */
        menuSide="right"
      />
    </SafeAreaView>
  </SafeAreaProvider>

);

export default App;
