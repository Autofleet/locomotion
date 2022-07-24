import React from 'react';
import SvgIcon from '../SvgIcon';
import { ButtonContainer } from './styled';

interface ButtonProps {
    onPress: any,
    icon: any,
    style: Record<string, unknown>,
    noLoader: boolean,
}
const SquareSvgButton = ({
  onPress, icon, style, noLoader,
}: ButtonProps) => (
  <ButtonContainer
    noLoader={noLoader}
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
