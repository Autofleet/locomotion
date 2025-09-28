import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LocomotionRouter from './src/LocomotionRouter';
import customLogo from './src/assets/logo.png';
import customI18n from './src/I18n/en.json';

const App = () => (
  <SafeAreaProvider>
    <StatusBar translucent={false} barStyle="dark-content" />
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
      <LocomotionRouter
        i18n={{ default: 'en', translations: [{ lang: 'en', translation: customI18n }] }}
        menuSide="right"
        logo={customLogo}
      />
    </SafeAreaView>
  </SafeAreaProvider>

);

export default App;
