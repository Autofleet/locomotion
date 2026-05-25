/**
 * Metro configuration for React Native
 * https://reactnative.dev/docs/metro
 *
 * @format
 */

const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const getRnPolyfills = require('@react-native/js-polyfills');

const config = {
  serializer: {
    // Prepend our setImmediate/clearImmediate fallback before RN's default
    // polyfill chain so it runs before any module-load warning can route into
    // LogBox and hit the Hermes "Property 'setImmediate' doesn't exist" race
    // on RN 0.76 + Fabric bootstrap. Once InitializeCore runs, RN's lazy
    // polyfillGlobal definitions replace these stubs.
    getPolyfills: () => [
      path.resolve(__dirname, 'polyfills/early-immediate-polyfill.js'),
      ...getRnPolyfills(),
    ],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: ['bin', 'txt', 'jpg', 'png', 'json', 'gif', 'webp', 'ttf', 'woff', 'woff2', 'otf'],
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'svg'],
    /**
     * Replace the emoji-based Flag component inside react-native-country-picker-modal
     * (nested in react-native-phone-number-input) with a custom SVG implementation.
     * This fixes country flag rendering on iOS with React Native 0.76 (TextKit2),
     * where Regional Indicator Symbol emoji sequences no longer render correctly.
     */
    resolveRequest: (context, moduleName, platform) => {
      if (
        moduleName === './Flag' &&
        context.originModulePath.includes('react-native-country-picker-modal')
      ) {
        return {
          filePath: path.resolve(
            __dirname,
            'src/Components/PhoneNumberInput/CountryFlag.js',
          ),
          type: 'sourceFile',
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
