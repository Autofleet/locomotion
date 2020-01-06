import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import i18n from '../../../I18n';

import Button from '../../../Components/Button';

export const Drawer = styled.View`
  position: absolute;
  bottom: 80;
  width: 90%;
  background-color: #fff;
  left: 5%;
  border-radius: 10;
  shadow-offset: 0px 10px;
  shadow-color: #212b44;
  shadow-opacity: 0.3;
  shadow-radius: 10px;
`;

const address = `
  min-height: 50;
  padding-top: 10;
  padding-bottom: 10;
  padding-start: 24;
  align-items: center;
  flex-direction: row;
  color: #212b44;
`;


export const RideCard = styled.View`
  ${address}
  border-bottom-color: #f2f2f2;
  border-bottom-width: 1;
  flex-direction: column;
  padding-start: 10;
  padding-end: 20;
`;

export const DriverAvatar = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 100;
  margin-top: -100px;
  align-self: center;
  margin-left: 50%;
  border-width: 1px;
  border-color: #a7a7a7;
  margin-bottom: 10px;
`;

const styleForDriverIsArrivedState = `
  height: 60px;
  color: #212b44;
  margin-top: 40px;
`;

export const RideStatusText = styled.Text`
  font-size: 16;
  color: #666666;
  align-self: center;
  margin-top: 10px;
  ${({ state }) => (state === 'driverArrived' ? styleForDriverIsArrivedState : null)}
`;

export const RideDetailsText = styled.Text`
  font-size: 13;
  color: #212b44;
  margin-top: 6px;
  align-self: center;
  text-align: ${({ right }) => (right ? 'right' : 'left')};
  /* background-color: red; */
`;


export const RideButton = styled(Button)`
  height: 50;
  border-bottom-end-radius: 10;
  border-bottom-start-radius: 10;
  flex: 1;
  justify-content: center;
  align-items: center;
  ${({ inRide, readyToBook }) => {
    if (inRide) {
      return 'background-color: #f03a5f;';
    }
    if (readyToBook) {
      return 'background-color: #00435c;';
    }
    return 'background-color: #666666;';
  }}
  /* background-color: #666666; */
`;

export const RideDetailsContainer = styled.View`
  flex: 1;
  flex-direction: row;
  width: 100%;
  margin-top: 16;
`;

export const RideButtonText = styled.Text`
  color: #fff;
  font-size: 18;
`;


export const RowContainer = styled.TouchableOpacity`
  min-height: 50;
  padding-top: 10;
  padding-bottom: 10;
  align-items: center;
  flex-direction: row;
  ${({ paddingStart }) => (paddingStart ? `
  padding-start: 24;
  ` : null)}
  ${({ useBorder }) => (useBorder ? `
    border-bottom-color: #f2f2f2;
    border-bottom-width: 1;
  ` : null)}
`;

const EtaContainer = styled.View`
  flex-direction: row;
  align-self: flex-end;
`;

const EtaText = styled.Text`
  
`;
const EtaTitleText = styled.Text`
  font-weight: 500;
`;

export const PreRideBox = styled(({ eta, estimatePrice, ...props }) => (
  <View {...props}>
    <EtaContainer><EtaTitleText>ETA: </EtaTitleText><EtaText>{eta ? eta.toFixed(0) : ''}</EtaText></EtaContainer>
    <EtaContainer right>
      <EtaTitleText>Estimate price: </EtaTitleText>
      <EtaText>{estimatePrice ? estimatePrice.toFixed(0) : ''}{i18n.t('currency')}</EtaText>
    </EtaContainer>
  </View>
  ))`
    padding: 10px 25px;
    width: 100%;
    justify-content: space-between;
    flex-direction: row;
  `;


export const RideTypeButton = styled.TouchableOpacity`
  align-items: center;
  flex: 1;
`;


export const RideTypeButtonText = styled.Text`
  flex: 1;
  min-width: 120px;
  text-align: center;
  align-items: center;
  flex-direction: row;
  padding: 10px;
  border-radius: 5px;
  background-color: #e6f0f5;
  ${({ active }) => (active ? `
  background-color: #c9e2f0;
  box-shadow: 0px 5px 5px rgba(0,0,0,0.05);
  ` : null)}
`;