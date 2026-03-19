import React from 'react';
import SvgIcon from '../SvgIcon';
import { ButtonContainer } from './styled';

interface ButtonProps {
    onPress: any,
    icon: any,
    style: Record<string, unknown>,
    noLoader: boolean,
    testID: string;
}
function SquareSvgButton({
  onPress, icon, style, noLoader, testID = 'headerButton',
}: ButtonProps) {
  return (
    <ButtonContainer
      noLoader={noLoader}
      onPress={onPress}
      testID={testID}
      style={style}
    >
      <SvgIcon
        Svg={icon}
        height={20}
        width={20}
      />
    </ButtonContainer>
  );
}

export default SquareSvgButton;
