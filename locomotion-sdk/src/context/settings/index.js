import React, { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import network from '../../services/network';
import { getAppSettings, getWorkingHoursData } from './apis';

const useSettings = () => {
  const [settingsList, setSettingsList] = useState({});
  const [workingHours, setWorkingHours] = useState({});
  const getSettings = async () => {
    const settings = await getAppSettings()
    setSettingsList(settings);
  };

  const getWorkingHours = async () => {
    const workingHoursData = await getWorkingHoursData()
    const prepWorkingHours = prepareWorkingHours(workingHoursData)
    setWorkingHours(prepWorkingHours);
  };

  const prepareWorkingHours = (workingHoursData) => {
    let preparedworkingHours = {};
    workingHoursData.map(timeSlot => {
      if(!preparedworkingHours[timeSlot.dayInWeek]) {
        preparedworkingHours[timeSlot.dayInWeek] = [];
      }

      preparedworkingHours[timeSlot.dayInWeek].push({start: timeSlot.startTime, end: timeSlot.endTime})
    })
    return preparedworkingHours;
  }

  return {
    settingsList,
    getSettings,
    getWorkingHours,
    workingHours
  };
};
export default createContainer(useSettings);
