import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { getSettings, update } from './api';

const useSettings = () => {
    const [SettingsMap, setSettingsMap] = useState([]);


    const loadSettings= async () => {
        const SettingsData = await getSettings();
        setSettingsMap(SettingsData);
    };

    const getSettingIndex = settingId => SettingsMap.findIndex(u => u.id === settingId);

    const setSetting = (settingId, newData) => {
        const index = getSettingIndex(settingId);
        const tmp = [...SettingsMap];
        tmp[index] = { ...tmp[index], ...newData };
        if (Object.keys(newData).length === 0) {
            tmp.splice(index, 1);
        }

        setSettingsMap(tmp);
    };

    const UpdateSetting = async (settingId, newData) => {
        if (Object.keys(newData).length !== 0) {
            const updateState = await update(settingId, newData);
            if (updateState) {
                setSetting(settingId, newData);
            }
        }
    };

    const getSetting = settingId => SettingsMap.find(setting => setting.id === settingId);

    return {
        loadSettings,
        SettingsMap,
        UpdateSetting,
        getSetting
    };
};

export default createContainer(useSettings);

