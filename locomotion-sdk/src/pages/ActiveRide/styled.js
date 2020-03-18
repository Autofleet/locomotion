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

export const StationDot = styled(PointDot)`
  width: 18;
  height: 18;
  border-radius: 20;
  background-color: #C3C0C0;
`;

export const PickupDot = styled(StationDot)`
  background-color: #6380C0;
`;

export const DropoffDot = styled(StationDot)`
  background-color: green;
`;

export const MarkerToolTip = styled.View`
    flexDirection: row;
    alignSelf: flex-start;
    paddingHorizontal: 6;
    paddingVertical: 3;
    borderRadius: 6;
    borderColor: #007a87;
    borderWidth: 0.5;
`;

export const PickupMarkerToolTip = styled(MarkerToolTip)`
    width: 60;
    backgroundColor: #6180C0;
`;

export const ExitMarkerToolTip = styled(MarkerToolTip)`
    width: 50;
    backgroundColor: green;
`;

export const MarkerToolTipText = styled.Text`
    text-align: center;
    width: 100%;
    color: #fff;
    flex: 1;
    font-size: 10px;
    font-weight: 700;
`;
