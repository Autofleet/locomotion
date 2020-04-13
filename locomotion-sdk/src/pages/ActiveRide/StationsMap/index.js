import React from 'react';
import I18n from '../../../I18n';

import StationMarker from './stationMarker';

export default ({
  markersMap, isInOffer, selectStation, requestStopPoints,activeRideState
}) => (
  markersMap.map(marker => {
    const {lat,lng} = marker;
    const pickup = requestStopPoints.pickup && requestStopPoints.pickup.lng === lng && requestStopPoints.pickup.lat === lat;
    const dropoff = requestStopPoints.dropoff && requestStopPoints.dropoff.lng === lng && requestStopPoints.dropoff.lat === lat;

    const getMarkerType = () => {
      if (pickup) {
        return 'pickup'
      }

      if (dropoff) {
        return 'dropoff';
      }


      return null;
    }

    const markerType = getMarkerType();
    if((isInOffer || activeRideState) && markerType === null) {
      return null;
    }
    return (
      <StationMarker
        key={marker.id}
        stationKey={marker.id}
        selectStation={selectStation}
        type={markerType}
        {...marker}
      />
    )
  })
);
