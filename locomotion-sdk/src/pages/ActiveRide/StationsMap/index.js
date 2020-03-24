import React from 'react';
import I18n from '../../../I18n';

import StationMarker from './stationMarker';

export default ({
  markersMap, rideOffer, isInOffer, selectStation, requestStopPoints,
}) => (
  markersMap.map(marker => (
    <StationMarker
      stationKey={marker.id}
      isInOffer={false}
      selectStation={selectStation}
      requestStopPoints={requestStopPoints}
      {...marker}
    />
  ))
);
