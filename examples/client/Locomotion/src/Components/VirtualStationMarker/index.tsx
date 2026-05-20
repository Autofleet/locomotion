import React, {
  forwardRef, useCallback, useImperativeHandle, useRef,
} from 'react';
import {
  Marker, Callout,
} from 'react-native-maps';

import VirtualStationComponent from '../VirtualStationComponent';
import VirtualStationTooltip from '../VirtualStationTooltipComponent';
import { useMarkerTracksViewChanges } from '../Marker/useMarkerTracksViewChanges';

const VirtualStationMarker = forwardRef(({
  station, onCalloutPress, type,
}, ref) => {
  const isActive = useCallback(() => type !== 'default', [type]);
  const markerRef = useRef<any>(null);
  useImperativeHandle(ref, () => markerRef.current);
  const { tracksViewChanges, onMarkerLayout } = useMarkerTracksViewChanges(markerRef);
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
