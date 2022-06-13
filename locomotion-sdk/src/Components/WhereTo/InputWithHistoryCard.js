import React from 'react';
import { MapButtonsContainer } from '../../pages/ActiveRide/NewRideDrawer/style';
import MyLocationButton from '../ShowMyLocationButton';

const InputWithHistoryCard = () => (
  <>

    <MapButtonsContainer>
      <MyLocationButton
        onPress={() => ({})}
        displayButton
      />
    </MapButtonsContainer>
  </>
);

export default InputWithHistoryCard;
