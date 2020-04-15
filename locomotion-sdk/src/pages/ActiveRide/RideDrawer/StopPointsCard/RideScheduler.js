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
import DateTimePicker from './DateTimePicker';

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
  height: 35px;
  flex-direction: row;
  margin-bottom: 10px;
`;

const TimeItem = styled.TouchableOpacity`
  flex: 1;
  background-color: ${({ selected }) => (selected ? '#6180c0' : '#ffffff')};
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: #b5b5b5;

  ${({ side }) => (side === 'right' ? `
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border-left-width: 0;
  ` : null)}

  ${({ side }) => (side === 'left' ? `
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-right-width: 0;
  ` : null)}

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

const OrderTimeSelector = ({
  selected, text, onPress, side,
}) => (
  <TimeItem selected={selected} onPress={onPress} side={side}>
    <TextContainer selected={selected}>{text}</TextContainer>
  </TimeItem>

);

export default ({ onScheduleTimeSelect }) => {
  const [ScheduleType, setScheduleType] = useState('now');

  const onScheduleTypeSelect = (type) => {
    setScheduleType(type);
    if (type === 'now') {
      onScheduleTimeSelect(null);
    }
  };


  return (
    <Container>
      <SelectionTitle>
        I want to start
      </SelectionTitle>
      <TimeItemContainer>
        <OrderTimeSelector
          text="Now"
          selected={ScheduleType === 'now'}
          onPress={() => onScheduleTypeSelect('now')}
          side="left"
        />
        <OrderTimeSelector
          text="Later"
          selected={ScheduleType === 'future'}
          onPress={() => onScheduleTypeSelect('future')}
          side="right"
        />
      </TimeItemContainer>
      {ScheduleType === 'future'
        ? (
          <DateTimePicker
            onScheduleTimeSelect={onScheduleTimeSelect}
          />
        )
        : null}
    </Container>
  );
};
