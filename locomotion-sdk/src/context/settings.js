import React, { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import network from '../services/network';

const useSettings = () => {
  const [settingsList, setSettingsList] = useState({});
  const getSettings = async () => {
    const { data: settings } = await network.get('/api/v1/me/app-settings');
    setSettingsList(settings);
  };

  return {
    settingsList,
    getSettings,
  };
};
export default createContainer(useSettings);
