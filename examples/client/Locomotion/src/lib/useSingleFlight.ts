import { useRef } from 'react';

const useSingleFlight = <A extends unknown[]>(fn: (...args: A) => Promise<void>) => {
  const inFlightRef = useRef(false);
  return async (...args: A): Promise<void> => {
    if (inFlightRef.current) {
      return;
    }
    inFlightRef.current = true;
    try {
      await fn(...args);
    } finally {
      inFlightRef.current = false;
    }
  };
};

export default useSingleFlight;
