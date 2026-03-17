import React, { forwardRef } from 'react';
import {
  Marker, Callout, MapMarker,
} from 'react-native-maps';
import { Platform } from 'react-native';
import Config from 'react-native-config';

import { Station } from '../../context/virtualStationsContext';
import VirtualStationComponent from '../VirtualStationComponent';
import VirtualStationTooltip from '../VirtualStationTooltipComponent';

interface VirtualStationMarkerProps {
  station: Station;
  onCalloutPress: (station: Station) => void;
  type: string;
}

const VirtualStationMarker = forwardRef<MapMarker, VirtualStationMarkerProps>(({
  station, onCalloutPress, type,
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
        <VirtualStationTooltip station={station} onPress={onCalloutPress} />
      </Callout>

    </Marker>
  ));
export default VirtualStationMarker;

VirtualStationMarker.defaultProps = {
  station: {} as Station,
  onCalloutPress: () => null,
  type: 'default',
};
