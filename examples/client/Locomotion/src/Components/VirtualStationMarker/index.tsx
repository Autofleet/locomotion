import React, {
  forwardRef, useCallback, useImperativeHandle, useRef, useState,
} from 'react';
import {
  Marker, Callout,
} from 'react-native-maps';
import { Platform } from 'react-native';

import VirtualStationComponent from '../VirtualStationComponent';
import VirtualStationTooltip from '../VirtualStationTooltipComponent';

const VirtualStationMarker = forwardRef(({
  station, onCalloutPress, type,
}, ref) => {
  const isActive = useCallback(() => type !== 'default', [type]);
  const markerRef = useRef<any>(null);
  useImperativeHandle(ref, () => markerRef.current);
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const onMarkerLayout = useCallback(() => {
    if (Platform.OS === 'android' && markerRef.current?.redraw) {
      markerRef.current.redraw();
    }
    setTracksViewChanges(prev => (prev ? false : prev));
  }, []);
  return (
    <Marker
      coordinate={{ latitude: parseFloat(station.coordinates.lat), longitude: parseFloat(station.coordinates.lng) }}
      zIndex={10}
      tracksViewChanges={tracksViewChanges}
      key={station.externalId}
      ref={markerRef}
      onLayout={onMarkerLayout}
    >
      <VirtualStationComponent type={type} isActive={isActive()} />

      <Callout tooltip>
        <VirtualStationTooltip station={station} onPress={onCalloutPress} />
      </Callout>

    </Marker>
  );
});
export default VirtualStationMarker;

VirtualStationMarker.defaultProps = {
  station: {},
  onCalloutPress: () => null,
  type: 'default',
};
