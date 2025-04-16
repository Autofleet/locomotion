import { unitsFactors } from '@turf/turf';
import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import { StorageService } from '../../services';
import * as settingsApi from './api';
import settingsKeys from './keys';

const FIVE_MINS_IN_SECONDS = 5 * 60;
const fieldNameToSettingKeyMap = {
  contactUsUrl: settingsKeys.CONTACT_US_URL,
  contactUsText: settingsKeys.CONTACT_US_TEXT,
  termsOfUseUrl: settingsKeys.TERMS_OF_USE_URL,
  privacyPolicyUrl: settingsKeys.PRIVACY_POLICY_URL,
  contactEmail: settingsKeys.CONTACT_EMAIL,
  contactPhone: settingsKeys.CONTACT_PHONE,
  measureSystem: settingsKeys.MEASURE_SYSTEM,
};


const useSettings = () => {
  const [settingsList, setSettingsList] = useState({});
  const [workingHours, setWorkingHours] = useState({});
  const [measureSystem, setMeasureSystem] = useState('metric');
  const [appSettingsState, setAppSettingsState] = useState({});
  const [showPrice, setShowPrice] = useState(false);


  const getSettingByKey = async (key, invalidateCache = false) => {
    let value = await StorageService.get(key);
    if (value === undefined || invalidateCache) {
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
      keys.map((key, idx) => {
        if (key !== null) {
          settingMap[key] = values[idx];
        }
      });
      await StorageService.save(settingMap, FIVE_MINS_IN_SECONDS);
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

  const getWorkingHours = async () => {
    const workingHoursData = await settingsApi.getWorkingHoursData();
    const prepWorkingHours = prepareWorkingHours(workingHoursData);
    setWorkingHours(prepWorkingHours);
  };

  const getAppSettings = async () => {
    const appSettings = await settingsApi.getAppSettings();
    await StorageService.save(appSettings, FIVE_MINS_IN_SECONDS);
    setAppSettingsState(appSettingsState);
    return appSettings;
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

  const getMeasureSystem = async () => {
    if (measureSystem) {
      return measureSystem;
    }

    const measureSystemValue = await getSettingByKey('riderApp.measureSystem');
    if (measureSystemValue) {
      setMeasureSystem(measureSystemValue);
      return measureSystemValue;
    }

    return null;
  };

  const setAppSettingsStates = async (settings) => {
    if (!settings.measureSystem) {
      setMeasureSystem(settings.measureSystem);
    }
  };

  useEffect(() => {
    setAppSettingsStates(appSettingsState);
  }, [appSettingsState]);

  const loadShowPrice = async (showPriceToMembersOfBA) => {
    if (showPriceToMembersOfBA !== undefined) {
      setShowPrice(showPriceToMembersOfBA);
    } else {
      const hidePrice = await getSettingByKey(settingsKeys.HIDE_PRICE);
      setShowPrice(!hidePrice);
    }
  };

  return {
    settingsList,
    getWorkingHours,
    workingHours,
    getSettingByKey,
    getMultipleSettingByKey,
    getLoginSettings,
    getAppSettings,
    getMeasureSystem,
    measureSystem,
    loadShowPrice,
    showPrice,
  };
};
export default createContainer(useSettings);
