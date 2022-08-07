import React, {
  createContext, useEffect, useState, useContext,
} from 'react';
import { useIsFocused } from '@react-navigation/native';
import settings from '../settings';
import { UserContext } from '../user';
import useInterval from '../../lib/useInterval';
import { getPosition } from '../../services/geo';
import * as availabilityApi from './api';
import SETTINGS_KEYS from '../settings/keys';


interface AvailabilityLocation {
    lat: string;
    lng: string;
    bearing: number;
}

export interface AvailabilityVehicles {
  id: string;
  location: AvailabilityLocation;
}

interface AvailabilityContextInterface {
  availabilityVehicles: AvailabilityVehicles[],
}

export const AvailabilityContext = createContext<AvailabilityContextInterface>({
  availabilityVehicles: [],
});

const AvailabilityContextProvider = ({ children }: { children: any }) => {
  const [availabilityVehicles, setAvailabilityVehicles] = useState<AvailabilityVehicles[]>([]);
  const { locationGranted, businessModelId } = useContext(UserContext);
  const { getSettingByKey } = settings.useContainer();
  const [showAvailableVehicles, setShowAvailableVehicles] = useState(false);
  const getVehicles = async () => {
    if (locationGranted) {
      try {
        let coords;
        try {
          const location = await getPosition();
          if (location) {
            ({ coords } = location);
          }
        } catch (e) {
          console.error('no pos', e);
        }
        const {
          latitude: lat, longitude: lng,
        } = coords || {};
        if (lat && lng) {
          const { vehicles } = await availabilityApi.getVehicles(lat, lng);
          await setAvailabilityVehicles(vehicles);
        }
      } catch (e) {
        console.error('setAvailabilityVehicles', e);
      }
    }
  };

  const isFocused = useIsFocused();

  useInterval(() => {
    if (isFocused && showAvailableVehicles) {
      getVehicles();
    }
  }, 5000);

  useEffect(() => {
    if (showAvailableVehicles) {
      getVehicles();
    }
  }, [isFocused, showAvailableVehicles]);

  const checkSetting = async () => {
    const value = await getSettingByKey(
      SETTINGS_KEYS.SHOW_AVAILABLE_VEHICLES,
      { businessModelId },
    );
    setShowAvailableVehicles(value);
  };

  useEffect(() => {
    checkSetting();
  }, [isFocused]);

  return (
    <AvailabilityContext.Provider
      value={{
        availabilityVehicles,
      }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
};


export default AvailabilityContextProvider;
