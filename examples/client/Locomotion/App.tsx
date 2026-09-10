import { SystemBars } from 'react-native-edge-to-edge';
import { SafeAreaProvider, SafeAreaView, initialWindowMetrics } from 'react-native-safe-area-context';
import LocomotionRouter from './src/LocomotionRouter';
import customLogo from './src/assets/logo.png';
import customI18n from './src/I18n/en.json';

const App = () => (
  <SafeAreaProvider initialMetrics={initialWindowMetrics}>
    <SystemBars style="dark" />
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
