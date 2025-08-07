module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    ['jsx-property-alias', {
      properties: {
        testID: 'accessibilityLabel',
      },
    }],
  ],
};
