import { unitsFactors } from '@turf/turf';
import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { StorageService } from '../../services';
import * as settingsApi from './api';

const FIVE_MINS_IN_SECONDS = 5 * 60;
const fieldNameToSettingKeyMap = {
  contactUsUrl: 'riderApp.contactUsUrl',
  termsOfUseUrl: 'riderApp.termsOfUseUrl',
  privacyPolicyUrl: 'riderApp.privacyPolicyUrl',
  contactEmail: 'riderApp.contactEmail',
  contactPhone: 'riderApp.contactPhone',
};


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

  const getMultipleSettingByKey = async (keys) => {
    const keyValueMap = await StorageService.get(keys);
    const cachedKeys = Object.keys(keyValueMap);
    const keysAfterCache = cachedKeys.filter(cacheKey => !Object.keys(keyValueMap)
      .includes(cacheKey) || keyValueMap[cacheKey] === undefined);
    const settingMap = {};
    if (keysAfterCache.length > 0) {
      const values = await settingsApi.getMultipleByKeys(keysAfterCache);
      // eslint-disable-next-line array-callback-return
      keys.map((key, idx) => {
        if (key !== null) {
          settingMap[key] = values[idx];
        }
      });
      await StorageService.save(settingMap);
    }

    return {
      ...keyValueMap,
      ...settingMap,
    };
  };

  const getLoginSettings = async () => {
    const loginSettings = await getMultipleSettingByKey(Object.values(fieldNameToSettingKeyMap));
    const formattedResult = {};

    // this format meant for us not changing a lot of code in case changing settings keys
    Object.keys(loginSettings).map((key) => {
      const fieldName = Object.keys(fieldNameToSettingKeyMap)
        .find(field => fieldNameToSettingKeyMap[field] === key);
      formattedResult[fieldName] = loginSettings[key];
      return formattedResult;
    });

    return formattedResult;
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
    getLoginSettings,
  };
};
export default createContainer(useSettings);
