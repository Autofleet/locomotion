import React from 'react';
import { Callout, Marker } from 'react-native-maps';
import CustomMarker from './CustomMarker'

export default ({
  stationKey, lat, lng, selectStation, requestStopPoints, isInOffer,
}) => {
  const pickup = requestStopPoints.pickup && requestStopPoints.pickup.lng === lng && requestStopPoints.pickup.lat === lat;
  const dropoff = requestStopPoints.dropoff && requestStopPoints.dropoff.lng === lng && requestStopPoints.dropoff.lat === lat;

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
      tracksViewChanges={false}
      key={stationKey}
    >
      {getMarker()}
    </Marker>

  );
};
