import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
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
}: GenericRideButtonProps) => (
  <>
    <SvgIcon stroke="#38a7fc" fill="#38a7fc" Svg={icon} height={15} width={15} />
    <TimeText numberOfLines={1}>{title}</TimeText>
  </>
);

export default GenericRideButton;
