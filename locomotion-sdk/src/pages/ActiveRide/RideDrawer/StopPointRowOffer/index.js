import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import EtaText from './EtaText'
import i18n from '../../../../I18n';

const address = `
min-height: 50;
padding-top: 10;
padding-bottom: 10;
padding-start: 24;
align-items: center;
flex-direction: row;
`;

export const StopPointDot = styled.View`
  width: 10;
  height: 10;
  background-color: ${({ origin }) => (origin ? '#6180c0' : '#08902d')};
  border-radius: 10;
`;


export const PickupRow = styled.View`
${address}
border-bottom-color: #f2f2f2;
border-bottom-width: 1;
`;

const StopPointDotContainer = styled.View`
  position: absolute;
  left: 16;
  ${({ origin }) => (origin ? 'bottom: 10;' : 'top: -10;')}
  justify-content: center;
  align-items: center;
  ${({ origin }) => (origin ? '' : 'flex-direction: column-reverse;')}
  width: 20;
  height: 100%;
`;

const StopPointDotTimeLine = styled.View`
  width: 2;
  flex: 1;
  background-color: ${({origin}) => origin ? '#6180c0' : '#08902d'};
`;


const AddressTextCont = styled.View`
  flex: 1;
`;

const AddressText = styled.Text`
  font-size: 14px;
  color: ${({pickup}) => pickup ? '#6180c0' : '#08902d'};
  margin-start: 22;
  margin-end: 16;
`;


const RowContainer = styled.View`
  min-height: 20;
  padding-top: 10px;
  padding-bottom: 10px;
  align-items: center;
  flex-direction: row;
  ${({ paddingStart }) => (paddingStart ? `
  padding-start: 24;
  ` : null)}
  ${({ useBorder }) => (useBorder ? `
    border-bottom-color: #e2e2e2;
    border-bottom-width: 1;
  ` : null)}
`;

export default ({
  pickup, description, eta, completedAt, openLocationSelect, useBorder,rideOffer,etaDrift
}) => (
  <RowContainer pickup={pickup} useBorder={useBorder} paddingStart>
    <StopPointDotContainer origin={pickup}>
      <StopPointDot origin={pickup} />
      <StopPointDotTimeLine origin={pickup} />
    </StopPointDotContainer>
    <AddressTextCont>
      <AddressText numberOfLines={2} pickup={pickup}>
        {`${pickup ? 'Boarding' : 'Exit'}: ${description}`}
      </AddressText>
      <EtaText eta={rideOffer[(pickup ? 'pickup' : 'dropoff')].eta} etaDrift={etaDrift} pickup={pickup} />
    </AddressTextCont>
  </RowContainer>
);



