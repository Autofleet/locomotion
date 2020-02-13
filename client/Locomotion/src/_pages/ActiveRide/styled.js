import React from 'react';
import { StyleSheet } from 'react-native';
import styled from 'styled-components';

export const PageContainer = styled.View({
  ...StyleSheet.absoluteFillObject,
});

export const StopPointDot = styled.View`
  width: 15;
  height: 15;
  border-radius: 15;
  border-color: #fff;
  border-width: 3;
  background-color: #8ac1ff;
  shadow-offset: 0px 0px;
  shadow-color: #04214f;
  shadow-opacity: 0.4;
  shadow-radius: 4.65;
`;

export const VehicleDot = styled.View`
  width: 20;
  height: 20;
  border-radius: 20;
  border-color: #fff;
  border-width: 3;
  background-color: #2384ff;
  shadow-offset: 0px 0px;
  shadow-color: #04214f;
  shadow-opacity: 0.4;
  shadow-radius: 4.65;
`;
