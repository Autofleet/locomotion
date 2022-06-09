import React from 'react';
import MyLocationButton from '../../../Components/ShowMyLocationButton';
import { DrawerContainer, MapButtonsContainer, DrawerContentContainer } from './style';
import InputWithHistoryCard from '../../../Components/WhereTo/InputWithHistoryCard';
import BottomSheet from '../RideDrawer/AddressSelector'

const NewRideDrawer = ({
  focusCurrentLocation,
}) => (
<>
<DrawerContainer>
    <MapButtonsContainer>
      <MyLocationButton
        onPress={() => focusCurrentLocation()}
        displayButton
        />
    </MapButtonsContainer>
  </DrawerContainer>
  <BottomSheet></BottomSheet>
        </>
);

export default NewRideDrawer;
