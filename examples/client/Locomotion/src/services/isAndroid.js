import React from 'react';
import { Platform } from 'react-native';

export const isAndroid = Platform.OS === 'android';

export const OsContainer = ({ forAndroid, forIos, children }) => {
  const Container = isAndroid ? forAndroid : forIos;
  return (
    <Container>
      {children}
    </Container>
  );
};
