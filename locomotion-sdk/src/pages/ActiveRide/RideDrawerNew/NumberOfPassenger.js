import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import BasicPopup from '../../../popups/BasicPopup';
import i18n from '../../../I18n';
import { getTogglePopupsState } from '../../../context/main';

const PassengerAmountIconSource = require('../../../assets/ppl.png');
const PlusIconSource = require('../../../assets/plus.png');
const MinusIconSource = require('../../../assets/minus.png');

const MAX_NUMBER_OF_PASSENGER = 5;
const MIN_NUMBER_OF_PASSENGER = 1;

const PassengerAmountContainer = styled.View`
  width: 70px;
  height: 50px;
  /* background-color: red; */
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  text-align: center;
`;

const PassengerAmountTouchableOpacity = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  margin-right: 15px;
  border-width: 1;
  border-color: #333333;
  border-radius: 3;
  padding: 5px;
  padding-right: 8px;
  padding-left: 8px;
`;

const PassengerAmountIcon = styled.Image.attrs({ source: PassengerAmountIconSource })`
  width: 16px;
  height: 16px;
  margin-top: 2;
`;

const PassengerAmountText = styled.Text`
  font-size: 16px;
  font-weight: 100;
  margin-left: 8px;
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
`

const SetPassengerAmountBox = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  background-color: ${({ disabled }) => disabled ? '#e8e8e8' : '#fafafb'};
  align-items: center;
`;

const PassengerAmountBox = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export default ({ amount, onChange }) => {
  const [isPopupOpen, togglePopup] = getTogglePopupsState();
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
      <PassengerAmountTouchableOpacity onPress={() => togglePopup('numberOfPassenger', true)}>
        <PassengerAmountIcon />
        <PassengerAmountText>{amount}</PassengerAmountText>
      </PassengerAmountTouchableOpacity>
      <BasicPopup
        id="numberOfPassenger"
        title={i18n.t('popups.selectNumberOfPassenger.main')}
        content={(
          <Fragment>
            <SetPassengerAmountContainer>
              <SetPassengerAmountBox disabled={!validateChange(newAmount, -1)} onPress={getNewAmountFunction(-1)}><MinusIcon /></SetPassengerAmountBox>
              <PassengerAmountBox><PassengerAmountIcon /><PassengerAmountText>{newAmount}</PassengerAmountText></PassengerAmountBox>
              <SetPassengerAmountBox disabled={!validateChange(newAmount, 1)} onPress={getNewAmountFunction(1)}><PlusIcon /></SetPassengerAmountBox>
            </SetPassengerAmountContainer>
          </Fragment>
        )}
        onClose={() => onChange(newAmount)}
      />
    </PassengerAmountContainer>
  )
}