import React from 'react';
import {Platform} from 'react-native'
import { Callout, Marker } from 'react-native-maps';

import AppleCustomMarker from './AppleCustomMarker'
import GoogleCustomMarker from './GoogleCustomMarker'
import Config from 'react-native-config';

const CustomMarkerSelector = (props) => {
  if(Platform.OS === 'ios') {
    if(Config.MAP_PROVIDER !== 'google') {
      return AppleCustomMarker;
    }
  }

  return GoogleCustomMarker;
}

export default ({
  stationKey, lat, lng, selectStation, isInOffer, type
}) => {
  const CustomMarker = CustomMarkerSelector();
  return (
    <Marker
      coordinate={{ latitude: parseFloat(lat), longitude: parseFloat(lng) }}
      onPress={e => selectStation(stationKey)}
      style={type ? { zIndex: 1 } : {}}
      key={stationKey}
      tracksViewChanges={Platform.OS === 'ios' && Config.MAP_PROVIDER === 'google'}
    >
      <CustomMarker type={type} />
    </Marker>

  );
};
