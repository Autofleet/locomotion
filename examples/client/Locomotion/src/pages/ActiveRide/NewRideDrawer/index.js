import React from 'react';
import MyLocationButton from '../../../Components/ShowMyLocationButton';
import { DrawerContainer, MapButtonsContainer, DrawerContentContainer } from './style';
import InputWithHistoryCard from '../../../Components/WhereTo/InputWithHistoryCard';

function NewRideDrawer({
  focusCurrentLocation,
}) {
  return (
    <DrawerContainer>
      <MapButtonsContainer>
        <MyLocationButton
          onPress={() => focusCurrentLocation()}
          displayButton
        />
      </MapButtonsContainer>
    </DrawerContainer>
  );
}

export default NewRideDrawer;
