import React from 'react';
import I18n from '../../../I18n';

import StationMarker from './stationMarker';

export default ({
  markersMap, isInOffer, selectStation, requestStopPoints, activeRideState,
}) => (
  markersMap.map((marker) => {
    const { lat, lng } = marker;
    let pickup; let
      dropoff;

    if (!activeRideState) {
      pickup = requestStopPoints.pickup && requestStopPoints.pickup.lng === lng && requestStopPoints.pickup.lat === lat;
      dropoff = requestStopPoints.dropoff && requestStopPoints.dropoff.lng === lng && requestStopPoints.dropoff.lat === lat;
    } else {
      pickup = activeRideState.stopPoints && activeRideState.stopPoints[0].lng === lng && activeRideState.stopPoints[0].lat === lat;
      dropoff = activeRideState.stopPoints && activeRideState.stopPoints[1].lng === lng && activeRideState.stopPoints[1].lat === lat;
    }

    const getMarkerType = () => {
      if (pickup) {
        return 'pickup';
      }

      if (dropoff) {
        return 'dropoff';
      }


      return null;
    };

    const markerType = getMarkerType();
    if ((isInOffer || activeRideState) && markerType === null) {
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
    );
  })
);
