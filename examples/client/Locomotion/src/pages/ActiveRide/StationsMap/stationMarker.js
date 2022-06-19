import React from 'react';
import { Platform } from 'react-native';
import { Callout, Marker } from 'react-native-maps';

import Config from 'react-native-config';
import AppleCustomMarker from './AppleCustomMarker';
import GoogleCustomMarker from './GoogleCustomMarker';
import Mixpanel from '../../../services/Mixpanel';

const CustomMarkerSelector = (props) => {
  if (Platform.OS === 'ios') {
    if (Config.MAP_PROVIDER !== 'google') {
      return AppleCustomMarker;
    }
  }

  return GoogleCustomMarker;
};

export default ({
  stationKey, lat, lng, selectStation, isInOffer, type,
}) => {
  const CustomMarker = CustomMarkerSelector();
  return (
    <Marker
      coordinate={{ latitude: parseFloat(lat), longitude: parseFloat(lng) }}
      onPress={(e) => {
        Mixpanel.trackElementClick({ id: 'SelectStationButton' });
        selectStation(stationKey);
      }}
      style={type ? { zIndex: 1 } : {}}
      key={stationKey}
      tracksViewChanges={Platform.OS === 'ios' && Config.MAP_PROVIDER === 'google'}
    >
      <CustomMarker type={type} />
    </Marker>

  );
};
