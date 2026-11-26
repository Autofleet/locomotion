import {
  MutableRefObject, useCallback, useEffect, useRef, useState,
} from 'react';
import { Platform } from 'react-native';

interface MarkerLike {
  redraw?: () => void;
}

const REDRAW_DELAY_MS = 50;

export const useMarkerTracksViewChanges = <T extends MarkerLike>(
  markerRef: MutableRefObject<T | null>,
) => {
  const [tracksViewChanges, setTracksViewChanges] = useState(Platform.OS === 'android');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const scheduleRedraw = useCallback((stopTracking = false) => {
    if (Platform.OS !== 'android') {
      return;
    }
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      markerRef.current?.redraw?.();
      if (stopTracking) {
        setTracksViewChanges(false);
      }
    }, REDRAW_DELAY_MS);
  }, [markerRef]);

  const onMarkerLayout = useCallback(() => scheduleRedraw(true), [scheduleRedraw]);

  return { tracksViewChanges, onMarkerLayout, scheduleRedraw };
};
