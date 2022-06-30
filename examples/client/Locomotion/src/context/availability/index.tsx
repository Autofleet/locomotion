import React, { createContext, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
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

const AvailabilityContextProvider = ({ children }: { children: any }) => {
  const [availabilityVehicles, setAvailabilityVehicles] = useState<AvailabilityVehicles[]>([]);

  const getVehicles = async () => {
    try {
      let coords;
      try {
        ({ coords } = await getPosition());
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
