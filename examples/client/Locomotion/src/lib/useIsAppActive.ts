import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

// iOS reports `inactive` for the notification shade, Face ID, Apple Pay and incoming calls; the app is still on screen.
const isForeground = (state: AppStateStatus) => state !== 'background';

const useIsAppActive = () => {
  const [isAppActive, setIsAppActive] = useState(isForeground(AppState.currentState));

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setIsAppActive(isForeground(nextAppState));
    });
    return () => subscription.remove();
  }, []);

  return isAppActive;
};

export default useIsAppActive;
