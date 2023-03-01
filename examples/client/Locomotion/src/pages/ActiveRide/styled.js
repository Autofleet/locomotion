import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import styled from 'styled-components';
import { STATIC_SNAP_POINTS } from '../../context/bottomSheetContext';
import vehicleIcon from '../../assets/car-icon.png';
import Icon from '../../assets/location_pin.svg';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

const MARKER_SIZE = {
  height: 39,
  width: 30,
};

export const PageContainer = styled.View({
  ...StyleSheet.absoluteFillObject,
});

export const PointDot = styled.View`
    border-color: #fff;
    border-width: 3px;
    shadow-offset: 0px 0px;
    shadow-color: #04214f;
    shadow-opacity: 0.4;
    shadow-radius: 4.65;
  `;

export const StopPointDot = styled(PointDot)`
    width: 15px;
    height: 15px;
    border-radius: 15px;
    background-color: #8ac1ff;
  `;

export const VehicleDotContainer = styled.View`
  `;

export const VehicleIcon = styled.Image`
    width: 30px;
    height: 30px;
    border-radius: 30px;
    border: 1px solid #09304e;
  `;

export const VehicleDot = ({ source }) => (
  <VehicleDotContainer>
    <VehicleIcon source={vehicleIcon} />
  </VehicleDotContainer>
);

export const MapButtonsContainer = styled.View``;

export const LocationMarkerContainer = styled.View`
  background-color: transparent;
  position: absolute;
  top: ${((Dimensions.get('window').height - STATIC_SNAP_POINTS) * 0.5) - MARKER_SIZE.height};
  left: ${(Dimensions.get('window').width - MARKER_SIZE.width) * 0.5};
`;

export const PickupTextContainer = styled.View`
background-color: #212229;
padding: 6px 8px;
border-radius: 6px;
justify-content: center;
flex-direction: row;
height: 30;
width: 120;
right: ${(120 - MARKER_SIZE.width) * 0.5};
top: -2;

${({ hide }) => hide && `
    opacity: 0;
  `}
`;

export const PickupText = styled.Text`
color: white;
${FONT_SIZES.LARGE}
${FONT_WEIGHTS.REGULAR}
`;

export const LocationMarker = styled(Icon).attrs(({ theme }) => ({
  height: MARKER_SIZE.height,
  fill: theme.primaryColor,
  stroke: theme.pageBackgroundColor,
  width: MARKER_SIZE.width,
}))``;


export const MapOverlayButtons = styled.View`
position: absolute;
width: 100%;
padding: 0 20px;
display: flex;
flex-direction: row;
justify-content: space-between;
`;

export const BlackOverlay = styled.View`
width: 100%;
height: ${({ bottomSheetHeight }) => Dimensions.get('window').height - bottomSheetHeight};
background-color: #333;
opacity: 0.7;
z-index: 99;
position: absolute;
`;
