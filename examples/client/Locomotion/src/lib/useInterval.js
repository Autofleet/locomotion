import { useRef, useEffect } from 'react';
import { InteractionManager } from 'react-native';

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    const tick = () => {
      if (savedCallback && typeof savedCallback.current !== 'undefined') {
        InteractionManager.runAfterInteractions(() => {
          savedCallback.current();
        });
      }
    };
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }

    return null;
  }, [delay]);
};
export default useInterval;
