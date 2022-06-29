import React from 'react';
import SvgIcon from '../SvgIcon';
import { ButtonContainer } from './styled';

interface ButtonProps {
    onPress: any,
    icon: any,
    style: Record<string, unknown>
}
const SquareSvgButton = ({ onPress, icon, style }: ButtonProps) => (
  <ButtonContainer
    onPress={onPress}
    data-test-id="headerButton"
    style={style}
  >
    <SvgIcon
      Svg={icon}
      height={20}
      width={20}
    />
  </ButtonContainer>
);

export default SquareSvgButton;
