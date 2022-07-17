import { RideInterface } from 'context/newRideContext';
import React, {
  createContext,
  useState,
  useEffect,
  Dispatch,
} from 'react';
import * as futureRideApi from './api';

interface FutureRidesContextInterface {
    futureRides: RideInterface[];
    newFutureRide: RideInterface | null;
    setNewFutureRide: Dispatch<RideInterface | null>;
}

export const FutureRidesContext = createContext<FutureRidesContextInterface>({
  futureRides: [],
  newFutureRide: null,
  setNewFutureRide: () => undefined,
});

const FutureRidesProvider = ({ children }: { children: any }) => {
  const [futureRides, setFutureRides] = useState<RideInterface[]>([]);
  const [newFutureRide, setNewFutureRide] = useState<RideInterface | null>(null);

  const getFutureRides = () => {
    const rides = futureRideApi.getFutureRides();
    setFutureRides(rides);
  };

  useEffect(() => {
    getFutureRides();
  }, []);

  return (
    <FutureRidesContext.Provider
      value={{
        futureRides,
        newFutureRide,
        setNewFutureRide,
      }}
    >
      {children}
    </FutureRidesContext.Provider>
  );
};

export default FutureRidesProvider;
