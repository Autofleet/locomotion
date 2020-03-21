import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';

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
  background-color: ${({ origin }) => (origin ? '#8ac1ff' : '#02cc64')};
  border-radius: 10;
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
  width: 1;
  flex: 1;
  background-color: #8aecff;
`;


const AddressTextCont = styled.View`
`;

const AddressText = styled.Text`
  font-size: 11;
  color: #666666;
  margin-top: 5px;
  min-height: 30px;
`;

const EtaText = styled.Text`
  font-size: 16px;
  color: #000000;
  font-weight: 600;
  margin-top: 10px;
`;

export const RowContainer = styled.TouchableOpacity`
  min-height: 50;
  padding-bottom: 10;
  align-items: center;
  flex-direction: column;
   ${({ paddingStart }) => (paddingStart ? `
  padding-start: 5;
  ` : null)}
  flex: 1;
`;

const StopPointTitle = styled.Text`
  font-size: 14px;
  color: ${({ pickup }) => (pickup ? '#6180c0' : '#08902d')};
  line-height: 16px;
`;

export default ({
  pickup, description, eta, completedAt, etaDrift, paddingStart,
}) => (
  <RowContainer pickup={pickup} paddingStart={paddingStart}>
    <AddressTextCont>
      <View>
        <StopPointTitle pickup={pickup}>
          {i18n.t(pickup ? 'home.bookingCard.pickupEtaTitle' : 'home.bookingCard.dropoffEtaTitle')}
        </StopPointTitle>
      </View>
      <View>
        <AddressText numberOfLines={2}>
          {description || i18n.t(pickup ? 'home.choosePickup' : 'home.chooseDropoff')}
        </AddressText>
      </View>
      <View>
        {eta || completedAt ? (
          <EtaText>
            {`${moment(eta).format('HH:mm')} - ${moment(eta).add(etaDrift, 'minutes').format('HH:mm')}`}
            {/* moment(eta || completedAt).fromNow() */}
          </EtaText>
        ) : null }
      </View>
    </AddressTextCont>
  </RowContainer>
);
