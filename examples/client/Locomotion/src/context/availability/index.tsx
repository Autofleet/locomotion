import React, {
  createContext, useContext, useMemo, useState,
} from 'react';
import { useIsFocused } from '@react-navigation/native';
import { UserContext } from '../user';
import usePolling from '../../lib/usePolling';
import useIsAppForeground from '../../lib/useIsAppForeground';
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
  const getVehicles = async (signal: AbortSignal) => {
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
    if (!lat || !lng || signal.aborted) {
      return;
    }
    const { vehicles } = await availabilityApi.getVehicles(lat, lng, signal);
    if (!signal.aborted) {
      setAvailabilityVehicles(vehicles);
    }
  };

  const isFocused = useIsFocused();
  const isAppForeground = useIsAppForeground();

  usePolling(getVehicles, {
    enabled: isFocused && isAppForeground && !!locationGranted,
    baseMs: AVAILABILITY_POLL_MS,
    maxMs: AVAILABILITY_MAX_BACKOFF_MS,
  });

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
};

export default AvailabilityContextProvider;
