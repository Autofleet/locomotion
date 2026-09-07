import React, {
  forwardRef, useCallback, useImperativeHandle, useRef,
} from 'react';
import {
  Marker, Callout, MapMarker,
} from 'react-native-maps';

import VirtualStationComponent from '../VirtualStationComponent';
import VirtualStationTooltip from '../VirtualStationTooltipComponent';
import { useMarkerTracksViewChanges } from '../Marker/useMarkerTracksViewChanges';
import type { Station } from '../../context/virtualStationsContext';

interface VirtualStationMarkerProps {
  station: Station;
  onCalloutPress?: (station: Station) => void;
  type?: string;
}

const VirtualStationMarker = forwardRef<MapMarker | null, VirtualStationMarkerProps>((
  { station, onCalloutPress = () => null, type = 'default' },
  ref,
) => {
  const isActive = useCallback(() => type !== 'default', [type]);
  const markerRef = useRef<MapMarker | null>(null);
  useImperativeHandle<MapMarker | null, MapMarker | null>(ref, () => markerRef.current);
  const { tracksViewChanges, onMarkerLayout } = useMarkerTracksViewChanges(markerRef);
  return (
    <Marker
      coordinate={{ latitude: Number(station.coordinates.lat), longitude: Number(station.coordinates.lng) }}
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
