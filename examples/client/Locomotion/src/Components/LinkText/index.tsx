import React from 'react';
import { TextInput, Text, TouchableOpacity } from 'react-native';
import propsTypes from 'prop-types';
import { LinkText, Container, StyledIcon } from './styled';

interface LinkTextProps {
    children: React.ReactNode;
    icon?: string;
    iconSide?: 'left' | 'right';
    onPress: () => void;
}

const LinkTextComponent = ({
  children, icon, iconSide = 'left', onPress = () => null,
}: LinkTextProps) => (
  <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
    <Container iconSide={iconSide}>
      {icon ? <StyledIcon icon={icon} iconSide={iconSide} width={18} height={18} /> : null}
      <LinkText>
        {children}
      </LinkText>
    </Container>
  </TouchableOpacity>
);

LinkTextComponent.defaultProps = {
  icon: null,
  iconSide: 'left',
};
export default LinkTextComponent;
