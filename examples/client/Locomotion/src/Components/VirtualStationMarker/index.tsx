import React, { forwardRef } from 'react';
import {
  Marker, Callout, MapMarker,
} from 'react-native-maps';

import { Station } from '../../context/virtualStationsContext';
import VirtualStationComponent from '../VirtualStationComponent';
import VirtualStationTooltip from '../VirtualStationTooltipComponent';

interface VirtualStationMarkerProps {
  station: Station;
  type: string;
}

const VirtualStationMarker = forwardRef<MapMarker, VirtualStationMarkerProps>(({
  station, type,
}, ref) => (
  <Marker
    coordinate={{ latitude: parseFloat(String(station.coordinates.lat)), longitude: parseFloat(String(station.coordinates.lng)) }}
    zIndex={10}
    tracksViewChanges={false}
    key={station.externalId}
    ref={ref}
  >
    <VirtualStationComponent type={type} isActive={type !== 'default'} />

    <Callout tooltip>
      <VirtualStationTooltip station={station} />
    </Callout>

  </Marker>
));

export default VirtualStationMarker;
