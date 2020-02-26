import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { getSettings, update } from './api';

const useSettings = () => {
    const [settingsMap, setSettingsMap] = useState([]);


    const loadSettings= async () => {
        const SettingsData = await getSettings();
        setSettingsMap(SettingsData);
    };

    const getSettingIndex = settingId => settingsMap.findIndex(u => u.id === settingId);

    const setSetting = (settingId, newData) => {
        const index = getSettingIndex(settingId);
        const tmp = [...settingsMap];
        tmp[index] = { ...tmp[index], ...newData };
        if (Object.keys(newData).length === 0) {
            tmp.splice(index, 1);
        }

        setSettingsMap(tmp);
    };

    const UpdateSetting = async (settingKey, newData) => {
        const { id: settingId} = getSetting(settingKey);
        if (Object.keys(newData).length !== 0) {
            const updateState = await update(settingId, newData);
            if (updateState) {
                setSetting(settingId, newData);
            }
        }
    };

    const getSetting = settingKey => settingsMap.find(setting => setting.key === settingKey);

    return {
        loadSettings,
        SettingsMap: settingsMap,
        UpdateSetting,
        getSetting
    };
};

export default createContainer(useSettings);

