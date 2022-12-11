import React from 'react';
import {
  Marker, Callout,
} from 'react-native-maps';
import { Platform } from 'react-native';
import Config from 'react-native-config';

import VirtualStationComponent from '../VirtualStationComponent';
import VirtualStationTooltip from '../VirtualStationTooltipComponent';


const VirtualStationMarker = ({ station, onCalloutPress }) => (
  <Marker
    coordinate={{ latitude: parseFloat(station.coordinates.lat), longitude: parseFloat(station.coordinates.lng) }}
    zIndex={10}
    tracksViewChanges={Platform.OS === 'ios' && Config.MAP_PROVIDER === 'google'}
  >
    <VirtualStationComponent />
    <Callout tooltip>
      <VirtualStationTooltip station={station} onPress={onCalloutPress} />
    </Callout>
  </Marker>
);

export default VirtualStationMarker;
