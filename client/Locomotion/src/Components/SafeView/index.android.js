import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';

export default ({ children, style, ...props }) => {
  if (Platform.OS === 'android' && DeviceInfo.hasNotch()) {
    SafeAreaView.setStatusBarHeight(35);
  }

  return (
    <SafeAreaView style={{ flex: 1 }} {...props} style={style}>
      {children}
    </SafeAreaView>
  );
};
