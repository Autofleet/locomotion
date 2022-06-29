import React from 'react';
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
      />
      {children}
    </Container>
  </SafeView>
);

export default Header;
