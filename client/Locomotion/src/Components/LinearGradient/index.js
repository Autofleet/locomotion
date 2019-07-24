import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { appPalette } from '../../assets/style-settings';

export default props => (
  <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={appPalette} {...props} />
);
