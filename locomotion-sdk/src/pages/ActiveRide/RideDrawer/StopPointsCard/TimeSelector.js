import React, { useState, useEffect, Fragment } from 'react';
import {
  Text, View, TouchableOpacity, TextInput,
} from 'react-native';
import styled from 'styled-components';
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import i18n from '../../../../I18n';
import { getTogglePopupsState } from '../../../../context/main';
import InputIcon from '../../../../assets/arrow-down.png';
import DateSelector from './DateTimePicker';

const Container = styled.View`
  min-height: 50;
  padding-top: 10;
  padding-bottom: 10;

  flex-direction: column;
  padding-start: 20;
  padding-end: 20;

`;

const TimeItemContainer = styled.View`
  width: 100%;
  border-radius: 4px;
  height: 35px;
  flex-direction: row;
  margin-bottom: 10px;
`;
const TimeItem = styled.TouchableOpacity`
  flex: 1;
  background-color: ${({ selected }) => (selected ? '#6180c0' : '#ffffff')};
  justify-content: center;
  align-items: center;
  `;

const TextContainer = styled.Text`
  color: ${({ selected }) => (selected ? '#ffffff' : '#b5b5b5')};
  font-size: 14px;
`;

const TitleContainer = styled.Text`
  flex: 1;
  padding-start: 20;
`;

const SelectionTitle = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: #000000;
  padding-bottom: 5px;
`;

const OrderTimeSelector = ({ selected, text, onPress }) => (
  <TimeItem selected={selected} onPress={onPress}>
    <TextContainer selected={selected}>{text}</TextContainer>
  </TimeItem>

);

export default ({ amount, onChange }) => {
  const [orderTime, setOrderTime] = useState('now');

  const onSelectOrderTime = (time) => {
    setOrderTime(time);
  };


  return (
    <Container>
      <SelectionTitle>
        I want to start
      </SelectionTitle>
      <TimeItemContainer>
        <OrderTimeSelector
          text="Now"
          selected={orderTime === 'now'}
          onPress={() => onSelectOrderTime('now')}
        />
        <OrderTimeSelector
          text="Later"
          selected={orderTime === 'future'}
          onPress={() => onSelectOrderTime('future')}
        />
      </TimeItemContainer>
      {orderTime === 'future' || true
        ? (
          <DateSelector />
        )
        : null}
    </Container>
  );
};
