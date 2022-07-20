import React from 'react';
import { Platform } from 'react-native';
import SquareSvgButton from '../SquareSvgButton';
import { Container } from './styled';
import SafeView from '../SafeView';

const Header = ({
  children, onPressIcon, icon,
}) => (
  <SafeView>
    <Container>
      <SquareSvgButton
        onPress={onPressIcon}
        icon={icon}
        style={Platform.OS === 'android' ? { shadowColor: '#000' } : {}}
      />
      {children}
    </Container>
  </SafeView>
);

export default Header;
