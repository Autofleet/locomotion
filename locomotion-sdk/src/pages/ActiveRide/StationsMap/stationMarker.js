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
  stationKey, lat, lng, selectStation, requestStopPoints, isInOffer,
}) => {
  const pickup = requestStopPoints.pickup && requestStopPoints.pickup.lng === lng && requestStopPoints.pickup.lat === lat;
  const dropoff = requestStopPoints.dropoff && requestStopPoints.dropoff.lng === lng && requestStopPoints.dropoff.lat === lat;
  const CustomMarker = CustomMarkerSelector();

  const getMarker = () => {
    if (pickup) {
      return (<CustomMarker type="pickup" />);
    }

    if (dropoff) {
      return (<CustomMarker type="dropoff" />);
    }

    if (!isInOffer) {
      return (<CustomMarker />);
    }

    return null;
  };

  return (
    <Marker
      coordinate={{ latitude: lat, longitude: lng }}
      onPress={e => !isInOffer && selectStation(stationKey, pickup, dropoff)}
      style={(pickup || dropoff) ? { zIndex: 1 } : {}}
      key={stationKey}
    >
      {getMarker()}
    </Marker>

  );
};
