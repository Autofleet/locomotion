import React from 'react';
import { StyleSheet } from 'react-native';
import styled from 'styled-components';

export const PageContainer = styled.View({
  ...StyleSheet.absoluteFillObject,
});

export const PointDot = styled.View`
  border-color: #fff;
  border-width: 3;
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

export const VehicleDot = styled(PointDot)`
  width: 20;
  height: 20;
  border-radius: 20;
  background-color: #2384ff;
`;

export const MapButtonsContainer = styled.View`
  position: absolute;
  bottom: 35%;
  width: 50px;
  left: 20px;
`;
