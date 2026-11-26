import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';

const useOnReconnect = (onReconnect: () => void) => {
  const callbackRef = useRef(onReconnect);

  useEffect(() => {
    callbackRef.current = onReconnect;
  });

  useEffect(() => {
    let wasConnected: boolean | null = null;
    return NetInfo.addEventListener(({ isConnected }) => {
      if (isConnected === null) {
        return;
      }
      if (wasConnected === false && isConnected) {
        callbackRef.current();
      }
      wasConnected = isConnected;
    });
  }, []);
};

export default useOnReconnect;
