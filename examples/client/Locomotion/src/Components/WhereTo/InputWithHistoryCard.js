import React from 'react';
import { MapButtonsContainer } from '../../pages/ActiveRide/NewRideDrawer/style';
import MyLocationButton from '../ShowMyLocationButton';

function InputWithHistoryCard() {
  return (
    <MapButtonsContainer>
      <MyLocationButton
        onPress={() => ({})}
        displayButton
      />
    </MapButtonsContainer>
  );
}

export default InputWithHistoryCard;
