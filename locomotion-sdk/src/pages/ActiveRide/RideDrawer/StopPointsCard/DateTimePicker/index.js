import React, { useState, useEffect, Fragment } from 'react';
import {
  Text, View, TouchableOpacity, TextInput,
} from 'react-native';
import styled from 'styled-components';
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import i18n from '../../../../../I18n';
import { getTogglePopupsState } from '../../../../../context/main';
import InputIcon from '../../../../../assets/arrow-down.png';
import settingsContext from '../../../../../context/settings';

const Container = styled.View`
  min-height: 50;
  padding-top: 10;
  padding-bottom: 10;

  flex-direction: column;
  padding-start: 20;
  padding-end: 20;

`;


const TimeSelectorsContainer = styled.View`
    width: 100%;
    height: 40px;
    flex-direction: row;
`;

const TimeSelectorItemContainer = styled.View`
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const TimeSelectorTitle = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: #000000;
`;

const TimeSelector = styled.TouchableOpacity`
  width: 60px;
  flex-direction: row;
`;

const InputText = styled.Text`
  color: #727272;
`;

const InputArrow = styled.Image.attrs({ source: InputIcon })`
    height: 20px;
    width: 20px;
`;


export default ({ onScheduleTimeSelect }) => {
  const useSettings = settingsContext.useContainer();
  const [optionalDates, setOptionalDates] = useState([]);
  const [optionalTimes, setOptionalTimes] = useState([]);
  const [scheduleOptions, setScheduleOptions] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const workingHours = {
    1: [{
      start: '08:00',
      end: '22:00',
    }],
    2: [
      {
        start: '08:00',
        end: '13:00',
      },
      {
        start: '15:00',
        end: '19:00',
      },
    ],
    3: [
      {
        start: '08:00',
        end: '16:00',
      },
      {
        start: '13:00',
        end: '19:00',
      },
    ],
    4: [
      {
        start: '08:00',
        end: '13:00',
      },
      {
        start: '16:00',
        end: '19:00',
      },
    ],
    5: [
      {
        start: '08:00',
        end: '13:00',
      },
      {
        start: '16:00',
        end: '19:00',
      },
    ],
    6: [
      {
        start: '08:00',
        end: '13:00',
      },
      {
        start: '16:00',
        end: '19:00',
      },
    ],
    7: [
      {
        start: '08:00',
        end: '13:00',
      },
      {
        start: '16:00',
        end: '19:00',
      },
    ],
  };

  const getOptionalDates = () => {
    const min = moment().add(useSettings.settingsList.FUTURE_ORDER_MIN_TIME, 'minutes');
    const max = moment(min).add(useSettings.settingsList.FUTURE_ORDER_MAX_TIME, 'hours');
    let calculatedDate = moment(min);
    const displayDates = [];
    const displayHours = {};
    while (calculatedDate.diff(max) < 0) {
      const date = moment(calculatedDate);
      const dayInWeek = date.day();

      if (workingHours[dayInWeek]) {
        displayDates.push(date.format('DD-MM-YYYY'));
        const timeData = getOptionalTimes(date.format('DD-MM-YYYY'), workingHours[dayInWeek]);
        const filteredTimeData = timeData.filter(time => moment(time).isSameOrAfter(min));

        if (filteredTimeData.length > 0) {
          displayHours[date.format('DD-MM-YYYY')] = filteredTimeData;
        }
      }
      calculatedDate = moment(calculatedDate).add(1, 'days');
    }

    setScheduleOptions(displayHours);
  };

  const getOptionalTimes = (date, dateWorkingHours) => {
    const timeInterval = useSettings.settingsList.FUTURE_ORDER_TIME_INTERVAL;
    const parseFormat = 'DD-MM-YYYY HH:mm';
    const timesArray = [];

    dateWorkingHours.map((timeFrame) => {
      const startTime = moment(`${date} ${timeFrame.start}`, parseFormat);
      const endTime = moment(`${date} ${timeFrame.end}`, parseFormat);
      let lastTime = startTime;
      const timeDiff = endTime.diff(startTime, 'minutes');
      const times = timeDiff / timeInterval;

      for (let i = 0; i <= times; i++) {
        timesArray.push(lastTime.format());
        lastTime = lastTime.add(timeInterval, 'minutes');
      }
    });

    const uniq = [...new Set(timesArray)];
    return uniq;
  };

  useEffect(() => {
    getOptionalDates();
  }, []);

  useEffect(() => {
    if (scheduleOptions) {
      const preparedDates = prepareForDatePicker(scheduleOptions);

      setOptionalDates(preparedDates);
      if (preparedDates.length) {
        setSelectedDate(preparedDates[0].value);
      }
    }
  }, [scheduleOptions]);


  useEffect(() => {
    if (selectedDate) {
      setOptionalTimes(prepareForTimePicker(scheduleOptions[selectedDate]));
    }
  }, [selectedDate]);

  useEffect(() => {
    onScheduleTimeSelect(selectedTime);
  }, [selectedTime]);

  const prepareForDatePicker = (data) => {
    const dates = Object.getOwnPropertyNames(data);
    const newData = dates.map(time => ({ label: time, value: time }));

    return newData;
  };

  const prepareForTimePicker = (data) => {
    const newData = data.map((time) => {
      const formatedTime = moment(time).format('HH:mm');
      return { label: formatedTime, value: time };
    });
    setSelectedTime(data[0]);
    return newData;
  };


  const TimePicker = ({
    title, items, value, onValueChange,
  }) => (
    <TimeSelectorItemContainer>
      <TimeSelectorTitle>{title}</TimeSelectorTitle>
      <RNPickerSelect
        items={items}
        onValueChange={onValueChange}
        style={{
          inputIOS: {
            fontSize: 14,
            color: '#727272',
            paddingRight: 25,
          },
          iconContainer: {
            right: 0,
            top: -2,
          },
        }}
        value={value}
        Icon={() => (<InputArrow />)}
      />
    </TimeSelectorItemContainer>
  );

  return (
    <TimeSelectorsContainer>
      <TimePicker
        title="Date"
        items={optionalDates}
        value={selectedDate}
        onValueChange={value => setSelectedDate(value)}
      />

      <TimePicker
        title="Hour"
        items={optionalTimes}
        value={selectedTime}
        onValueChange={value => setSelectedTime(value)}
      />

    </TimeSelectorsContainer>
  );
};
