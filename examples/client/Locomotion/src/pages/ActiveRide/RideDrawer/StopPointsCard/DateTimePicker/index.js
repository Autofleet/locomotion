import React, { useState, useEffect, Fragment } from 'react';
import {
  Text, View, TouchableOpacity, TextInput,
} from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import i18n from '../../../../../I18n';
import InputIcon from '../../../../../assets/arrow-down.png';
import settingsContext from '../../../../../context/settings';
import TimePicker from './Picker';

const TimeSelectorsContainer = styled.View`
    width: 100%;
    height: 40px;
    flex-direction: row;
`;

const DateTimePicker = ({ onScheduleTimeSelect }) => {
  const useSettings = settingsContext.useContainer();
  const [optionalDates, setOptionalDates] = useState([]);
  const [optionalTimes, setOptionalTimes] = useState([]);
  const [scheduleOptions, setScheduleOptions] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    useSettings.getWorkingHours();
  }, []);

  useEffect(() => {
    if (useSettings.workingHours) {
      getOptionalDates();
    }
  }, [useSettings.workingHours]);
  const getOptionalDates = () => {
    const { workingHours } = useSettings;
    const min = moment().add(useSettings.settingsList.FUTURE_ORDER_MIN_TIME, 'minutes');
    const max = moment(min).add(useSettings.settingsList.FUTURE_ORDER_MAX_TIME, 'hours');
    let calculatedDate = moment(min);
    const displayDates = [];
    const displayHours = {};
    while (calculatedDate.diff(max) < 0) {
      const date = moment(calculatedDate);
      const dayInWeek = date.day();

      if (workingHours[dayInWeek]) {
        displayDates.push(date.format('DD.MM.YYYY'));
        const timeData = getOptionalTimes(date.format('DD.MM.YYYY'), workingHours[dayInWeek]);
        const filteredTimeData = timeData.filter(time => moment(time).isSameOrAfter(min));

        if (filteredTimeData.length > 0) {
          displayHours[date.format('DD.MM.YYYY')] = filteredTimeData;
        }
      }
      calculatedDate = moment(calculatedDate).add(1, 'days');
    }

    setScheduleOptions(displayHours);
  };

  const getOptionalTimes = (date, dateWorkingHours) => {
    const timeInterval = useSettings.settingsList.FUTURE_ORDER_TIME_INTERVAL;
    const parseFormat = 'DD.MM.YYYY HH:mm';
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


  return (
    <TimeSelectorsContainer>
      <TimePicker
        title={i18n.t('home.RideScheduler.timePicker.date')}
        items={optionalDates}
        value={selectedDate}
        onValueChange={value => setSelectedDate(value)}
      />

      <TimePicker
        title={i18n.t('home.RideScheduler.timePicker.hour')}
        items={optionalTimes}
        value={selectedTime}
        onValueChange={value => setSelectedTime(value)}
      />

    </TimeSelectorsContainer>
  );
};

export default DateTimePicker;
