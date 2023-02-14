import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import { BaseToast } from 'react-native-toast-message';
import styled from 'styled-components';
import vehicleIcon from '../../assets/car-icon.png';
import Icon from '../../assets/location_pin.svg';

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

export const MapButtonsContainer = styled.View`
  `;

export const LocationMarkerContainer = styled.View`
  background-color: transparent;
`;

export const LocationMarker = styled(Icon).attrs(({ theme }) => ({
  height: '20%',
  position: 'absolute',
  bottom: Platform.OS === 'android' ? '45%' : '41%',
  left: '45%',
  fill: theme.primaryColor,
  stroke: theme.pageBackgroundColor,
  width: '10%',
  viewBox: '-1 0 13 10',
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
