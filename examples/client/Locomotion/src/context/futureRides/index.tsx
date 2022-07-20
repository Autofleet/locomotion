import React, {
  createContext,
  useState,
  useEffect,
  Dispatch,
  useContext,
} from 'react';
import useInterval from '../../lib/useInterval';
import { RideInterface } from '../newRideContext';
import * as futureRideApi from './api';
import { UserContext } from '../user';

interface FutureRidesContextInterface {
    futureRides: RideInterface[];
    newFutureRide: RideInterface | null;
    setNewFutureRide: Dispatch<RideInterface | null>;
    loadFutureRides: () => Promise<void>;
}

export const FutureRidesContext = createContext<FutureRidesContextInterface>({
  futureRides: [],
  newFutureRide: null,
  setNewFutureRide: () => undefined,
  loadFutureRides: async () => undefined,
});

const FutureRidesProvider = ({ children }: { children: any }) => {
  const { user } = useContext(UserContext);
  const [futureRides, setFutureRides] = useState<RideInterface[]>([]);
  const [newFutureRide, setNewFutureRide] = useState<RideInterface | null>(null);

  const loadFutureRides = async () => {
    const rides = await futureRideApi.getFutureRides();
    setFutureRides(rides);
  };

  useInterval(async () => {
    if (user?.id) {
      loadFutureRides();
    }
  }, 30000);

  useEffect(() => {
    if (user?.id) {
      loadFutureRides();
    }
  }, []);

  return (
    <FutureRidesContext.Provider
      value={{
        futureRides,
        newFutureRide,
        setNewFutureRide,
        loadFutureRides,
      }}
    >
      {children}
    </FutureRidesContext.Provider>
  );
};

export default FutureRidesProvider;
