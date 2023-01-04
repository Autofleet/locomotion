import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

import SvgIcon from '../SvgIcon';
import {
  FONT_SIZES, FONT_SIZES_VALUES, FONT_WEIGHTS, convertHextToRgba, LINK_BLUE_COLOR,
} from '../../context/theme';


export const Tooltip = styled.View`
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 200px;
  padding: 3px;
  border-radius: 8px;
  border-color: ${({ theme }) => theme.primaryColor};
  border-width: 2px;
`;

export const StationDetails = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 6px;
  padding-bottom: 0;
`;


export const BottomActions = styled.View`
  flex: 1;
  display: flex;
  background-color: #f0f0f0;
  padding: 6px;
`;


export const StationName = styled.Text`
  ${FONT_SIZES.H2}
  ${FONT_WEIGHTS.BOLD}
  text-transform: capitalize;
  flex:1;
`;

export const StyledText = styled.Text`
  ${FONT_SIZES.H3}
  color: #888788;
`;

export const DistanceText = styled.Text`
  ${FONT_SIZES.H3}
  color: #888788;
`;

export const Row = styled.View`
  flex 1;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

export const AddressText = styled.Text`
  ${FONT_SIZES.LARGE}
  color: #888788;
`;
