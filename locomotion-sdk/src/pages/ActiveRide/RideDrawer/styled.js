import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import i18n from '../../../I18n';

import RideRoundedButton from '../../../Components/RideButton';
import RoundedButton from '../../../Components/RoundedButton';
import Button from '../../../Components/Button';

export const Drawer = styled.View`
 /*  position: absolute;
  bottom: 50;
  width: 90%; */
  background-color: #fff;
  border-radius: 4;
  /* left: 5%;
  border-radius: 4;
  shadow-offset: 0px 0px;
  shadow-color: #04214f;
  shadow-opacity: 0.4; */

`;

const address = `
  min-height: 20;
  padding-top: 15px;
  padding-start: 24;
  align-items: center;
  flex-direction: row;
`;


export const RideCard = styled.View`
  ${address}
  min-height: 130px;
  flex-direction: column;
  padding-start: 10;
  padding-end: 10;
  padding-bottom: 0;
`;

export const DriverAvatar = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 100;
  margin-left: 15px;
  border-width: 1px;
  border-color: #a7a7a7;
  margin-bottom: 10px;
`;

const styleForDriverIsArrivedState = `
  color: #08902d;
`;


export const RideDetailsText = styled.Text`
  font-size: 12;
  color: #000000;
  margin-start: 10;
  text-align: ${({ right }) => (right ? 'right' : 'left')};

  ${({ subText }) => (subText ? `
    font-weight: 500;
    font-size: 12;
    margin-top: 5px;
  ` : null)}
`;

export const RideButtonContainer = styled.View`
  padding-top: 10px;
  padding-bottom: 10px;
  margin: 0 auto;
  min-height: 40px;
  width: 100%;
`;

export const DrawerButtonContainer = styled.View`
  padding-top: 10px;
  padding-bottom: 10px;
  margin: 0 auto;
  min-height: 40px;
  width: 50%;
`;

export const RideDetailsContainer = styled.View`
  flex: 1;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
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
    <EtaContainer>
      <EtaTitleText>ETA: </EtaTitleText>
      <EtaText>{eta ? eta.toFixed(0) : ''}</EtaText>
    </EtaContainer>
    <EtaContainer right>
      <EtaTitleText>Estimate price: </EtaTitleText>
      <EtaText>
        {estimatePrice ? estimatePrice.toFixed(0) : ''}
        {i18n.t('currency')}
      </EtaText>
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



export const DrawerContainer = styled.View`
  flex-direction: column;
  position: absolute;
  bottom: 20;
  width: 90%;
  left: 5%;
  border-radius: 4;
  shadow-offset: 0px 0px;
  shadow-color: #04214f;
  shadow-opacity: 0.4;
`;
