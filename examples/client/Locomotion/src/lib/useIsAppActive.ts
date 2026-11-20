import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

const useIsAppActive = () => {
  const [isAppActive, setIsAppActive] = useState(AppState.currentState === 'active');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setIsAppActive(nextAppState === 'active');
    });
    return () => subscription.remove();
  }, []);

  return isAppActive;
};

export default useIsAppActive;
