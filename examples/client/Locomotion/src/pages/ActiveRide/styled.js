import React from 'react';
import {StyleSheet} from 'react-native';
import styled from 'styled-components';
import vehicleIcon from '../../assets/car-icon.png';

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
  width: 15;
  height: 15;
  border-radius: 15;
  background-color: #8ac1ff;
`;

export const VehicleDotContainer = styled.View``;

export const VehicleIcon = styled.Image`
  width: 30;
  height: 30;
  border-radius: 30;
  border: 1px solid #09304e;
`;

export const VehicleDot = ({source}) => (
  <VehicleDotContainer>
    <VehicleIcon source={vehicleIcon} />
  </VehicleDotContainer>
);
/* export const VehicleDot = styled(PointDot)`
  width: 20;
  height: 20;
  border-radius: 20px;
  background-color: #2384ff;
`;
 */
export const MapButtonsContainer = styled.View`
  position: absolute;
  top: 25%;
  width: 50px;
  left: 20px;
`;
