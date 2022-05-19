
import React from 'react';
import styled from 'styled-components';

export const PointDot = styled.View`
  border-color: #fff;
  border-width: 3px;
  shadow-offset: 0px 0px;
  shadow-color: #04214f;
  shadow-opacity: 0.4;
  shadow-radius: 4.65;
  background-color: transparent;
`;

export const StationDot = styled(PointDot)`
  width: 18;
  height: 18;
  border-radius: 20px;
  background-color: #c3c0c0;

  ${({ type }) => type === 'pickup' && `
      background-color: #6180C0;
    `}

  ${({ type }) => type === 'dropoff' && `
    background-color: #08902d;
  `}

  ${({ isGoogle }) => isGoogle && `
    shadow-opacity: 0;
  `}
`;

export const MarkerToolTip = styled.View`
    min-width: 50px;
    height: 20px;
    padding: 3px 6px 3px 6px;
    border-radius: 4;
    box-shadow: 0 3px 6px #b5b5b5;
    background-color: #c3c0c0;

    ${({ type }) => type === 'pickup' && `
      background-color: #6180C0;
    `}

    ${({ type }) => type === 'dropoff' && `
      background-color: #08902d;
    `}
    align-items: center;
`;

export const MarkerToolTipText = styled.Text`
    text-align: center;
    width: 100%;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    flex: 1;
`;

export const MarkerContainer = styled.View`
  display: flex;
  align-items: center;
  padding: 2px;
`;
