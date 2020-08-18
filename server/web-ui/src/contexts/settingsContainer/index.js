import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { getSettings, update } from './api';

const useSettings = () => {
  const [settingsList, setSettingsList] = useState(null);

  const loadSettings = async () => {
    const SettingsData = await getSettings();
    setSettingsList(SettingsData);
  };

  const updateSettingsList = (settingId, newData) => {
    const tmp = { ...settingsList };
    tmp[settingId] = newData;
    setSettingsList(tmp);
  };

  const UpdateSetting = async (settingKey, newData) => {
    const updateState = await update(settingKey, { value: newData });
    if (updateState) {
      updateSettingsList(settingKey, newData.value);
    }
  };

  const getSettingByKey = settingKey => settingsList[settingKey];

  return {
    loadSettings,
    settingsList,
    UpdateSetting,
    getSettingByKey,
  };
};

export default createContainer(useSettings);

