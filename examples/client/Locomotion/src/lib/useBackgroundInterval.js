import { useRef, useEffect } from 'react';
import { InteractionManager } from 'react-native';
import reactNativeBackgroundTimer from 'react-native-background-timer';

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
      const id = reactNativeBackgroundTimer.setInterval(tick, delay);
      return () => reactNativeBackgroundTimer.clearInterval(id);
    }

    return null;
  }, [delay]);
};
export default useInterval;
