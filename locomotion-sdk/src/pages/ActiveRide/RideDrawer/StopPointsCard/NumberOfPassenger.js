import React, { useState, useEffect, Fragment } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components';
import i18n from '../../../../I18n';
import { getTogglePopupsState } from '../../../../context/main';
import Button from '../../../../Components/Button';

const PassengerAmountIconSource = require('../../../../assets/ppl.png');
const PlusIconSource = require('../../../../assets/plus.png');
const MinusIconSource = require('../../../../assets/minus.png');

const MAX_NUMBER_OF_PASSENGER = 5;
const MIN_NUMBER_OF_PASSENGER = 1;

const PassengerAmountContainer = styled.View`
  min-height: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  align-items: center;
  flex-direction: row;
  padding-start: 20;
`;

const PassengerAmountTouchableOpacity = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  margin-right: 15px;
  border-width: 1px;
  border-color: #333333;
  border-radius: 3px;
  padding: 5px;
  padding-right: 8px;
  padding-left: 8px;
`;

const PassengerAmountIcon = styled.Image.attrs({ source: PassengerAmountIconSource })`
  width: 16px;
  height: 16px;
`;

const PassengerAmountText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  width: 20px;
`;

const MinusIcon = styled.Image.attrs({ source: MinusIconSource })`
  width: 16px;
  height: 3px;
`;

const PlusIcon = styled.Image.attrs({ source: PlusIconSource })`
  width: 16px;
  height: 16px;
`;

const SetPassengerAmountContainer = styled.View`
  flex-direction: row;
  width: 200px;
  height: 50px;
  border-width: 1;
  border-color: #dedede;
  border-radius: 2;
  align-self: center;
`;

const SetPassengerAmountBox = styled(Button)`
  flex: 1;
  justify-content: center;
  background-color: transparent;
  align-items: center;
`;

const PassengerAmountBox = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;
const AddressText = styled.Text`
  font-size: 14px;
  color: #666666;
  margin-start: 10;
  margin-end: 16;
`;

const StopPointDotContainer = styled.View`
  position: absolute;
  left: 16;
  width: 200px;
  height: 100%;
  top: 16px;
`;

const SetPassengerAmountBoxContainer = styled.View`
  flex-direction: row;
  width: 25px;
  height: 25px;
  border-radius: 15px;
  border: 1px solid #525252;
  opacity: ${({ disabled }) => (disabled ? 0.3 : 0.7)};
`;

const PassengerControlersContainer = styled.View`
  width: 60;
  flex-direction: row;
  justify-content: space-between;
  margin-left: auto;
  margin-right: 15;
`;

export default ({ amount, onChange }) => {
  const [isPopupOpen, togglePopup] = getTogglePopupsState();
  const [newAmount, setNewAmount] = useState(amount);

  const validateChange = (newAmount, change) => MAX_NUMBER_OF_PASSENGER >= (newAmount + change) && (newAmount + change) >= MIN_NUMBER_OF_PASSENGER;

  const getNewAmountFunction = change => () => {
    if (!validateChange(newAmount, change)) {
      return;
    }
    setNewAmount(newAmount + change);
  };

  useEffect(() => {
    onChange(newAmount);
  }, [newAmount]);

  return (
    <PassengerAmountContainer>
      <View style={{ width: '100%', flexDirection: 'row' }}>
        <PassengerAmountIcon />
        <AddressText>{i18n.t('home.passengersNumber')}</AddressText>
        <PassengerAmountText>{newAmount}</PassengerAmountText>
        <PassengerControlersContainer>
          <SetPassengerAmountBoxContainer disabled={!validateChange(newAmount, -1)}>
            <SetPassengerAmountBox data-test-id='SetPassengerAmountMinusButton'
              onPress={getNewAmountFunction(-1)}
            >
              <MinusIcon />
            </SetPassengerAmountBox>
          </SetPassengerAmountBoxContainer>
          <SetPassengerAmountBoxContainer disabled={!validateChange(newAmount, 1)}>
            <SetPassengerAmountBox data-test-id='SetPassengerAmountPlusButton' onPress={getNewAmountFunction(1)}><PlusIcon /></SetPassengerAmountBox>
          </SetPassengerAmountBoxContainer>
        </PassengerControlersContainer>
      </View>
    </PassengerAmountContainer>
  );
};
