import type { MutableRefObject } from 'react';

const guardInFlight = <A extends unknown[]>(
  inFlightRef: MutableRefObject<boolean>,
  // eslint-disable-next-line no-unused-vars
  fn: (...args: A) => Promise<void>,
) => {
  const ref = inFlightRef;
  return async (...args: A): Promise<void> => {
    if (ref.current) {
      return;
    }
    ref.current = true;
    try {
      await fn(...args);
    } finally {
      ref.current = false;
    }
  };
};

export default guardInFlight;
