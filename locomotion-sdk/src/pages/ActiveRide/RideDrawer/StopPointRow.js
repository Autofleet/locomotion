import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import { RowContainer } from './styled';

import i18n from '../../../I18n';

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
  font-size: 13;
  color: #666666;
  margin-start: 22;
  margin-end: 16;
`;

const EtaText = styled.Text`
  font-size: 13;
  color: #808080;
  margin-start: 22;
  font-size: 10px;
`;



export default ({
  pickup, description, eta, completedAt, openLocationSelect, useBorder
}) => (
  <RowContainer pickup={pickup} onPress={openLocationSelect} useBorder paddingStart>
    <StopPointDotContainer origin={pickup}>
      <StopPointDot origin={pickup} />
      <StopPointDotTimeLine />
    </StopPointDotContainer>
    <AddressTextCont>
      <View>
        <AddressText numberOfLines={2}>
          {description || i18n.t(pickup ? 'home.choosePickup' : 'home.chooseDropoff')}
        </AddressText>
      </View>
      <View>
        {eta || completedAt ? (
          <EtaText>
            {moment(eta || completedAt).fromNow() }
          </EtaText>
        ) : null }
      </View>
    </AddressTextCont>
  </RowContainer>
);

