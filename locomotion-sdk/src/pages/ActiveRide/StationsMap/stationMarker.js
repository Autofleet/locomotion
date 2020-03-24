import React from 'react';
import { Callout, Marker } from 'react-native-maps';
import I18n from '../../../I18n';
import {
  MarkerToolTip,
  MarkerToolTipText,
  StationDot,
  MarkerContainer,
} from './styled';

const PickupMarkerContainer = ({ type }) => (
  <MarkerContainer>
    {type
      ? (
        <MarkerToolTip type={type}>
          <MarkerToolTipText>{I18n.t(`home.map.markers.${type}`)}</MarkerToolTipText>
        </MarkerToolTip>
      ) : null}
    <StationDot type={type} />
  </MarkerContainer>
);

export default ({
  stationKey, lat, lng, selectStation, requestStopPoints, isInOffer,
}) => {
  const pickup = requestStopPoints.pickup && requestStopPoints.pickup.lng === lng && requestStopPoints.pickup.lat === lat;
  const dropoff = requestStopPoints.dropoff && requestStopPoints.dropoff.lng === lng && requestStopPoints.dropoff.lat === lat;

  const getMarker = () => {
    if (pickup) {
      return (<PickupMarkerContainer type="pickup" />);
    }

    if (dropoff) {
      return (<PickupMarkerContainer type="dropoff" />);
    }

    if (!isInOffer) {
      return (<PickupMarkerContainer />);
    }

    return null;
  };

  return (
    <Marker
      coordinate={{ latitude: lat, longitude: lng }}
      onPress={e => !isInOffer && selectStation(stationKey, pickup, dropoff)}
    >
      {getMarker()}
    </Marker>

  );
};
