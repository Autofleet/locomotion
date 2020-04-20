import React, { useState, Fragment } from 'react';
import {Text, View} from 'react-native'
import styled from 'styled-components';
import i18n from '../../../../I18n';
import moment from 'moment'

const PassengerAmountIconSource = require('../../../../assets/ppl.png');
const PlusIconSource = require('../../../../assets/plus.png');
const MinusIconSource = require('../../../../assets/minus.png');
const ClockIconSource = require('../../../../assets/clock.png');

const MAX_NUMBER_OF_PASSENGER = 5;
const MIN_NUMBER_OF_PASSENGER = 1;

const PassengerAmountContainer = styled.View`
  padding-top: 10;
  padding-bottom: 10;
  align-items: center;
  flex-direction: row;
  padding-start: 20;
  border-bottom-color: #e2e2e2;
  border-bottom-width: 1;
`;

const PassengerAmountIcon = styled.Image.attrs({ source: PassengerAmountIconSource })`
  width: 11px;
  height: 11px;
`;

const PassengerAmountText = styled.Text`
  font-size: 12px;
  color: #b5b5b5;
`;

const AddressText = styled.Text`
  font-size: 12px;
  color: #b5b5b5;
  margin-start: 10;
  margin-end: 5;
`;

const ClockIcon = styled.Image.attrs({ source: ClockIconSource })`
  width: 15px;
  height: 15px;
`;

export default ({ amount, onChange,scheduledTo }) => {
  const [newAmount, setNewAmount] = useState(amount);

  const validateChange = (newAmount, change) => {
    return MAX_NUMBER_OF_PASSENGER >= (newAmount + change) && (newAmount + change) >= MIN_NUMBER_OF_PASSENGER
  }

  const getNewAmountFunction = change => () => {
    if (!validateChange(newAmount, change)) {
      return;
    }

    setNewAmount(newAmount + change);
  }

  return (
    <PassengerAmountContainer>
      <View style={{width: '100%', flexDirection: 'row', flex:1}}>
        <View style={{paddingTop: 2}}>
          <PassengerAmountIcon />
        </View>
        <AddressText>{i18n.t('home.offerCard.passengersNumber')}</AddressText>
        <PassengerAmountText>{newAmount}</PassengerAmountText>

      </View>
      {scheduledTo ?
      <View style={{flex:1, alignSelf: 'flex-end', flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{opacity: 0.3}}>
          <ClockIcon></ClockIcon>
        </View>
        <AddressText style={{ textAlign: 'center'}}>
          {moment(scheduledTo).format('DD-MM-YYYY HH:mm')}
        </AddressText>
      </View> : null}
    </PassengerAmountContainer>
  )
}