import React, {
  createContext,
  useState,
  useEffect,
  Dispatch,
  useContext,
  useRef,
} from 'react';
import useInterval from '../../lib/useInterval';
import { RideInterface } from '../newRideContext';
import * as futureRideApi from './api';
import { UserContext } from '../user';
import { RIDE_STATES, RIDE_FINAL_STATES } from '../../lib/commonTypes';

interface FutureRidesContextInterface {
    futureRides: RideInterface[];
    newFutureRide: RideInterface | null;
    setNewFutureRide: Dispatch<RideInterface | null>;
    loadFutureRides: () => Promise<void>;
    onFutureRideTransition?: (callback: (ride: RideInterface) => void) => void;
}

export const FutureRidesContext = createContext<FutureRidesContextInterface>({
  futureRides: [],
  newFutureRide: null,
  setNewFutureRide: () => undefined,
  loadFutureRides: async () => undefined,
  onFutureRideTransition: () => undefined,
});

const FutureRidesProvider = ({ children }: { children: any }) => {
  const { user } = useContext(UserContext);
  const [futureRides, setFutureRides] = useState<RideInterface[]>([]);
  const [newFutureRide, setNewFutureRide] = useState<RideInterface | null>(null);
  const activatedRideIds = useRef<Set<string>>(new Set());
  const transitionCallback = useRef<((ride: RideInterface) => void) | null>(null);

  const loadFutureRides = async () => {
    const rides = await futureRideApi.getFutureRides();
    if (rides.length === 0) {
      setFutureRides([]);
      return;
    }

    rides.forEach((ride: RideInterface) => {
      if (!ride.id) return;

      const isNotPending = ride.state !== RIDE_STATES.PENDING;
      const isFailingToMatch = ride.state === RIDE_STATES.PENDING && !!ride.lastMatchAttempt;
      const notYetActivated = !activatedRideIds.current.has(ride.id);

      if ((isNotPending || isFailingToMatch) && notYetActivated && transitionCallback.current) {
        transitionCallback.current(ride);
        activatedRideIds.current.add(ride.id);
      }
    });

    const currentRideIds = new Set(
      rides.map((r: RideInterface) => r.id).filter(Boolean) as string[],
    );

    activatedRideIds.current.forEach((id: string) => {
      if (!currentRideIds.has(id)) {
        activatedRideIds.current.delete(id);
      }
    });
    const activeRides = rides.filter(
      (ride: RideInterface) => !RIDE_FINAL_STATES.includes(ride.state || ''),
    );
    setFutureRides(activeRides);
  };

  const setOnFutureRideTransition = (callback: (ride: RideInterface) => void) => {
    transitionCallback.current = callback;
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
  }, [user?.id]);

  return (
    <FutureRidesContext.Provider
      value={{
        futureRides,
        newFutureRide,
        setNewFutureRide,
        loadFutureRides,
        onFutureRideTransition: setOnFutureRideTransition,
      }}
    >
      {children}
    </FutureRidesContext.Provider>
  );
};

export default FutureRidesProvider;
