module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['jsx-property-alias', {
      properties: {
        testID: 'accessibilityLabel',
      },
    }],
    'react-native-reanimated/plugin',
  ],
};
