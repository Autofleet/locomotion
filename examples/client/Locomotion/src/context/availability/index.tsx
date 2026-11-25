import React, {
  createContext, useState, useContext,
} from 'react';
import { useIsFocused } from '@react-navigation/native';
import { UserContext } from '../user';
import usePolling from '../../lib/usePolling';
import useIsAppActive from '../../lib/useIsAppActive';
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

const AVAILABILITY_POLL_MS = 15 * 1000;
const AVAILABILITY_MAX_BACKOFF_MS = 60 * 1000;

const AvailabilityContextProvider = ({ children }: { children: any }) => {
  const [availabilityVehicles, setAvailabilityVehicles] = useState<AvailabilityVehicles[]>([]);
  const { locationGranted } = useContext(UserContext);
  const getVehicles = async () => {
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
  };

  const isFocused = useIsFocused();
  const isAppActive = useIsAppActive();

  usePolling(getVehicles, {
    enabled: isFocused && isAppActive && !!locationGranted,
    baseMs: AVAILABILITY_POLL_MS,
    maxMs: AVAILABILITY_MAX_BACKOFF_MS,
  });

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
