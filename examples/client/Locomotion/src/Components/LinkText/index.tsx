import React from 'react';
import {
  LinkText, Container, StyledIcon, TouchableContainer,
} from './styled';

interface LinkTextProps {
    children: React.ReactNode;
    icon?: string;
    iconSide?: 'left' | 'right';
    onPress: () => void;
}

const LinkTextComponent = ({
  children, icon = undefined, iconSide = 'left', onPress = () => null,
}: LinkTextProps) => (
  <TouchableContainer onPress={onPress}>
    <Container iconSide={iconSide}>
      {icon ? <StyledIcon icon={icon} iconSide={iconSide} width={18} height={18} /> : null}
      <LinkText>
        {children}
      </LinkText>
    </Container>
  </TouchableContainer>
);

export default LinkTextComponent;
