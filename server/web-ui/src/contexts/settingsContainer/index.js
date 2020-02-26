import {useState} from 'react';
import {createContainer} from 'unstated-next';
import {getSettings, update} from './api';

const useSettings = () => {
    const [settingsMap, setSettingsMap] = useState([]);
    const [settingsObj, setSettingsObj] = useState({});

    const loadSettings= async () => {
        const newSettingsObj = {};
        const SettingsData = await getSettings();
        setSettingsMap(SettingsData);
        SettingsData.map(setting => {
            newSettingsObj[setting.key] = setting.value;
        });
        setSettingsObj(newSettingsObj);
    };

    const getSettingIndex = settingId => settingsMap.findIndex(u => u.id === settingId);

    const updateSettingsMap = (settingId, newData) => {
        const indexKey = getSettingIndex(settingId);
        const tmp = [...settingsMap];
        tmp[indexKey] = {...tmp[indexKey], ...newData};
        setSettingsMap(tmp);
    };

    const updateSettingsObj = (settingId, newData) => {
        const tmp = settingsObj;
        tmp[settingId] = newData;
        setSettingsObj(tmp);
    };

    const UpdateSetting = async (settingKey, newData) => {
        const { id: settingId} = getSetting(settingKey);
        if (Object.keys(newData).length !== 0) {
            const updateState = await update(settingId, newData);
            if (updateState) {
                updateSettingsMap(settingId, newData);
                updateSettingsObj(settingKey, newData.value);
            }
        }
    };

    const getSetting = settingKey => settingsMap.find(setting => setting.key === settingKey);
    const getSettingByKey = settingKey => settingsObj[settingKey];

    return {
        loadSettings,
        settingsObj,
        UpdateSetting,
        getSettingByKey
    };
};

export default createContainer(useSettings);

