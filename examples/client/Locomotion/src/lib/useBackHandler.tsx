import { useEffect } from 'react';
import { BackHandler } from 'react-native';

const EVENT_NAME = 'hardwareBackPress';

export default (handleBackButtonClick: () => boolean | null | undefined) => useEffect(() => {
  const eventListener = BackHandler.addEventListener(EVENT_NAME, handleBackButtonClick);
  return () => {
    eventListener.remove();
  };
}, []);
