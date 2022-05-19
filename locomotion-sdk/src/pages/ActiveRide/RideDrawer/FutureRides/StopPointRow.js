import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';

import i18n from '../../../../I18n';
import Button from '../../../../Components/Button';

const address = `
min-height: 50;
padding-top: 10;
padding-bottom: 10px;
padding-start: 24;
align-items: center;
flex-direction: row;
`;

export const StopPointDot = styled.View`
  width: 10px;
  height: 10px;
  background-color: ${({ origin }) => (origin ? '#6180c0' : '#08902d')};
  border-radius: 10px;
  /* margin-top: 10; */
`;


export const PickupRow = styled.View`
${address}
border-bottom-color: #f2f2f2;
border-bottom-width: 1;
`;

const StopPointDotContainer = styled.View`
  position: absolute;
  left: 16;
  ${({ origin }) => (origin ? 'bottom: -1;' : 'top: 0;')}
  justify-content: center;
  align-items: center;
  ${({ origin }) => (origin ? '' : 'flex-direction: column-reverse;')}
  width: 20;
  height: 100%;
`;

const StopPointDotTimeLine = styled.View`
  width: 2;
  flex: 1;
  background-color: #dbdbdb;
`;


const AddressTextCont = styled.View`
`;

const AddressText = styled.Text`
  font-size: 12px;
  color: #666666;
  margin-start: 16;
  margin-end: 16;
`;

const RowContainer = styled(Button)`
  min-height: 15px;
  align-items: ${({ pickup }) => (pickup ? 'flex-start' : 'flex-end')};


  flex-direction: row;
  ${({ paddingStart }) => (paddingStart ? `
  padding-start: 24;
  ` : null)}
`;

export default ({
  pickup, description, eta, completedAt, openLocationSelect, useBorder, title, selected,
}) => (
  <RowContainer pickup={pickup} onPress={openLocationSelect} useBorder={useBorder} paddingStart data-test-id="StopPointRowButton">
    <StopPointDotContainer origin={pickup}>
      <StopPointDot origin={pickup} />
      <StopPointDotTimeLine />
    </StopPointDotContainer>
    <AddressTextCont>
      <AddressText numberOfLines={2}>
        {description || i18n.t(pickup ? 'addressView.pickupPlaceholder' : 'addressView.dropoffPlaceholder')}
      </AddressText>
    </AddressTextCont>
  </RowContainer>
);
