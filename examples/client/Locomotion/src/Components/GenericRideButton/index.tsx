import React, { useContext } from 'react';
import { Text } from 'react-native';
import styled, { ThemeContext } from 'styled-components';
import SvgIcon from '../SvgIcon';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

const TimeText = styled(Text)`
    ${FONT_SIZES.LARGE}
    ${FONT_WEIGHTS.MEDIUM}
    color: #333;
    margin: 5px;
`;

interface GenericRideButtonProps {
    icon: string;
    title: string;
}

const GenericRideButton = ({
  icon,
  title,
}: GenericRideButtonProps) => {
  const { primaryColor } = useContext(ThemeContext);
  return (
    <>
      <SvgIcon stroke={primaryColor} fill={primaryColor} Svg={icon} height={15} width={15} />
      <TimeText numberOfLines={1}>{title}</TimeText>
    </>
  );
};

export default GenericRideButton;
