import React from 'react';
import { Platform, SafeAreaView } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export default ({ children, style, ...props }) => (
  <SafeAreaView {...props} style={style}>
    {children}
  </SafeAreaView>
);
