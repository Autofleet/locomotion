import React, {
  createContext, useEffect, useState, useContext, useMemo,
} from 'react';
import { useIsFocused } from '@react-navigation/native';
import { UserContext } from '../user';
import useInterval from '../../lib/useInterval';
import { getPosition } from '../../services/geo';
import * as availabilityApi from './api';

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

function AvailabilityContextProvider({ children }: { children: any }) {
  const [availabilityVehicles, setAvailabilityVehicles] = useState<AvailabilityVehicles[]>([]);
  const { locationGranted } = useContext(UserContext);
  const getVehicles = async () => {
    if (locationGranted) {
      try {
        let coords;
        try {
          const location = await getPosition({
            maximumAge: 1000 * 60 * 2,
          });
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
    if (isFocused) {
      getVehicles();
    }
  }, 5000);

  useEffect(() => {
    getVehicles();
  }, [isFocused]);

  const contextValue = useMemo(() => ({
    availabilityVehicles,
  }), [availabilityVehicles]);

  return (
    <AvailabilityContext.Provider
      value={contextValue}
    >
      {children}
    </AvailabilityContext.Provider>
  );
}

export default AvailabilityContextProvider;
