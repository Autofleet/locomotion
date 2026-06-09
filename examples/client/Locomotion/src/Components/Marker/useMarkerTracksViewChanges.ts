import { MutableRefObject, useCallback, useState } from 'react';
import { Platform } from 'react-native';

interface MarkerLike {
  redraw?: () => void;
}

export const useMarkerTracksViewChanges = <T extends MarkerLike>(
  markerRef: MutableRefObject<T | null>,
) => {
  const [tracksViewChanges, setTracksViewChanges] = useState(Platform.OS === 'android');
  const onMarkerLayout = useCallback(() => {
    if (Platform.OS === 'android' && markerRef.current?.redraw) {
      markerRef.current.redraw();
      setTracksViewChanges(false);
    }
  }, [markerRef]);
  return { tracksViewChanges, onMarkerLayout };
};
