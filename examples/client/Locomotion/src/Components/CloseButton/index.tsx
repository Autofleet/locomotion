import React from 'react';
import styled from 'styled-components';
import Button from '../Button';
import SvgIcon from '../SvgIcon';
import closeXIcon from '../../assets/close-x.svg';

const StyledCloseButton = styled(Button)`
  height: 25;
  width: 25;
  align-items: center;
  justify-content: center;
`;

const CloseButton = ({
  onPress,
  size,
  containerStyles,
}: {
  onPress: any;
  size?: number;
  containerStyles?: any;
}) => (
  <StyledCloseButton style={containerStyles} noBackground onPress={onPress}>
    <SvgIcon Svg={closeXIcon} width={size} height={size} fill="#333" />
  </StyledCloseButton>
);

CloseButton.defaultProps = {
  size: 15,
  containerStyles: {},
};
export default CloseButton;
