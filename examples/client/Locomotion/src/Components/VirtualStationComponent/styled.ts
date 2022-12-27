import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

import SvgIcon from '../SvgIcon';
import pickupIcon from '../../assets/map/markers/stations/pickup.svg';
import dropoffIcon from '../../assets/map/markers/stations/dropoff.svg';
import station from '../../assets/map/markers/stations/bus.svg';

interface IconsMap {
  [key: string]: React.FC;
}

const ICONS:IconsMap = {
  pickup: pickupIcon,
  dropoff: dropoffIcon,
  default: station,
};

export const Contrainer = styled.View`
    align-items: center;
    display: flex;
    width: 25px;
`;
export const MarkerContainer = styled.TouchableOpacity`
    width: 25px;
    height: 25px;
    border-radius: 4px;
    border-color: ${({ isActive = false, theme }) => (!isActive ? theme.primaryColor : theme.primaryButtonTextColor)};
    background-color: ${({ isActive = false, theme }) => (isActive ? theme.primaryColor : theme.primaryButtonTextColor)};
    border-width: 2px;
`;

interface MarkerProps {
  theme?: any;
  width?: number;
  height?: number;
  isActive?: boolean;
  type?: string;
}

export const IconContainer = styled(View)`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const StyledIcon = styled(SvgIcon).attrs(({
  theme,
  width = 24,
  height = 24,
  isActive = false,
  type = 'default',
}:MarkerProps) => ({
  Svg: ICONS[type] || ICONS.default,
  width,
  height,
  fill: !isActive ? theme.primaryColor : theme.primaryButtonTextColor,
}))``;
