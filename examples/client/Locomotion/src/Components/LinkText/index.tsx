import React from 'react';
import propsTypes from 'prop-types';
import {
  LinkText, Container, StyledIcon, TouchableContainer,
} from './styled';

interface LinkTextProps {
    children: React.ReactNode;
    icon?: string;
    iconSide?: 'left' | 'right';
    onPress: () => void;
}

function LinkTextComponent({
  children, icon = undefined, iconSide = 'left', onPress = () => null,
}: LinkTextProps) {
  return (
    <TouchableContainer onPress={onPress}>
      <Container iconSide={iconSide}>
        {icon ? <StyledIcon icon={icon} iconSide={iconSide} width={18} height={18} /> : null}
        <LinkText>
          {children}
        </LinkText>
      </Container>
    </TouchableContainer>
  );
}

export default LinkTextComponent;
