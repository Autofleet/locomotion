import React from 'react';
import { Platform } from 'react-native';
import SquareSvgButton from '../SquareSvgButton';
import { Container } from './styled';
import SafeView from '../SafeView';

const Header = ({
  children, onPressIcon, icon, testID,
}) => (
  <Container>
    <SquareSvgButton
      testID={testID}
      noLoader
      onPress={onPressIcon}
      icon={icon}
      style={Platform.OS === 'android' ? { shadowColor: '#000' } : {}}
    />
    {children}
  </Container>
);

export default Header;
