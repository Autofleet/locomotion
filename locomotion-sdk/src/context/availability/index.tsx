import React, { createContext, useEffect, useState } from 'react';
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
  const [availabilityVehiclesInterval, setAvailabilityVehiclesInterval] = useState<any | null>(null);

  const getVehicles = async () => {
    const {
      coords,
    } = await getPosition();
    const {
      latitude: lat, longitude: lng,
    } = coords;
    await fetchVehicles(lat, lng);
    setAvailabilityVehiclesInterval(setInterval(async () => {
      await fetchVehicles(lat, lng);
    }, 5000));
  };

  const fetchVehicles = async (lat: string, lng: string) => {
    if (lat && lng) {
      const { vehicles } = await availabilityApi.getVehicles(lat, lng);
      setAvailabilityVehicles(vehicles);
    }
  };

  useEffect(() => {
    getVehicles();
    return () => {
      if (availabilityVehiclesInterval) {
        clearInterval(availabilityVehiclesInterval);
      }
    };
  }, []);

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
