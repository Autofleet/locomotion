import React, { forwardRef, useCallback } from 'react';
import {
  Marker, Callout,
} from 'react-native-maps';
import { Platform } from 'react-native';
import Config from 'react-native-config';

import VirtualStationComponent from '../VirtualStationComponent';
import VirtualStationTooltip from '../VirtualStationTooltipComponent';

const trackViewChanges = Platform.OS === 'ios' && Config.MAP_PROVIDER === 'google';
const VirtualStationMarker = forwardRef(({
  station, onCalloutPress, type,
}, ref) => {
  const isActive = useCallback(() => type !== 'default', [type]);
  return (
    <Marker
      coordinate={{ latitude: parseFloat(station.coordinates.lat), longitude: parseFloat(station.coordinates.lng) }}
      zIndex={10}
      tracksViewChanges={trackViewChanges}
      key={station.externalId}
      ref={ref}
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
  onCalloutPress: () => {},
  type: 'default',
};
