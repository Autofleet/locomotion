import React from 'react';
import { StyleSheet } from 'react-native';
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
  position: absolute;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  top: 0;
  bottom: 45;
  left: 0;
  right: 0;
`;

export const LocationMarker = styled(Icon).attrs(({ theme }) => ({
  height: '80px',
  fill: theme.primaryColor,
  stroke: theme.pageBackgroundColor,
  width: '40px',
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
