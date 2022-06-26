import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { StorageService } from '../../services';
import * as settingsApi from './api';

const FIVE_MINS_IN_SECONDS = 5 * 60;

const useSettings = () => {
  const [settingsList, setSettingsList] = useState({});
  const [workingHours, setWorkingHours] = useState({});


  const getSettingByKey = async (key) => {
    let value = await StorageService.get(key);
    if (value === undefined) {
      ({ value } = await settingsApi.getByKey(key));
      await StorageService.save({
        [key]: value,
      }, FIVE_MINS_IN_SECONDS);
    }
    return value;
  };

  const getMultipleSettingByKey = (keys) => {
    const keyValueMap = await StorageService.get(keys);
    const cachedKeys = Object.keys(keyValueMap);
    const keysAfterCache = cachedKeys.map((cacheKey) => {
      const value = keyValueMap[cacheKey];
      if (value === undefined) {
        return cacheKey;
      }
    });
    const settingMap = {};
    const values = await settingsApi.getMultipleByKeys(keysAfterCache);
    // eslint-disable-next-line array-callback-return
    keys.map((key, idx) => {
      settingMap[key] = values[idx];
    });
    await StorageService.save(settingMap);
    return {
      ...settingMap,
      ...keyValueMap,
    };
  };

  const getSettings = async () => {
    const settings = await settingsApi.getAppSettings();
    setSettingsList(settings);
    return settings;
  };

  const getWorkingHours = async () => {
    const workingHoursData = await settingsApi.getWorkingHoursData();
    const prepWorkingHours = prepareWorkingHours(workingHoursData);
    setWorkingHours(prepWorkingHours);
  };

  const prepareWorkingHours = (workingHoursData) => {
    const preparedworkingHours = {};
    workingHoursData.map((timeSlot) => {
      if (!preparedworkingHours[timeSlot.dayInWeek]) {
        preparedworkingHours[timeSlot.dayInWeek] = [];
      }

      preparedworkingHours[timeSlot.dayInWeek].push({ start: timeSlot.startTime, end: timeSlot.endTime });
    });
    return preparedworkingHours;
  };

  return {
    settingsList,
    getSettings,
    getWorkingHours,
    workingHours,
    getSettingByKey,
    getMultipleSettingByKey,
  };
};
export default createContainer(useSettings);
