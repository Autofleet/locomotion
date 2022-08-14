import React from 'react';
import Button from '../Button';
import SvgIcon from '../SvgIcon';
import closeXIcon from '../../assets/close-x.svg';

const CloseButton = ({ onPress, size, containerStyles }: { onPress: any, size?: number, containerStyles?: any }) => (
  <Button
    style={containerStyles}
    noBackground
    onPress={onPress}
  >
    <SvgIcon
      Svg={closeXIcon}
      width={size}
      height={size}
      fill="#333"
    />
  </Button>
);

CloseButton.defaultProps = {
  size: 15,
  containerStyles: {},
};
export default CloseButton;
