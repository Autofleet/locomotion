import React, {
  useEffect,
} from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import geo from '../../services/geo';
import RidePageContextProvider from '../../context/ridePageContext';
import NewRidePageContextProvider from '../../context/newRideContext';
import {
  PageContainer,
} from './styled';
import Header from '../../Components/Header';
import RideDrawer from './NewRideDrawer';
import MainMap from './map';
import RideSummaryPopup from '../../popups/RideSummaryPopup';
import FutureRideCanceledPopup from '../../popups/FutureRideCanceled';
import BottomSheet from './RideDrawer/BottomSheet';
import AddressSelector from './RideDrawer/AddressSelector';


const RidePage = ({ menuSide, mapSettings }) => {
  const navigation = useNavigation();
  const mapRef = React.useRef();
  useEffect(() => {
    geo.init();
  }, []);

  return (
    <>
      <PageContainer>
        <MainMap ref={mapRef} mapSettings={mapSettings} />
        <Header navigation={navigation} menuSide={menuSide} />
        {/*       <RideDrawer
        navigation={navigation}
        focusCurrentLocation={() => {
          if (mapRef && mapRef.current) {
            mapRef.current.focusCurrentLocation();
          }
        }}
        />
        <RideSummaryPopup />
        <FutureRideCanceledPopup
        onClose={() => {
        }}
      /> */}
        <BottomSheet>
          <AddressSelector />
        </BottomSheet>
      </PageContainer>
    </>
  );
};

export default props => (
  <NewRidePageContextProvider {...props}>
    <RidePageContextProvider {...props}>
      <RidePage
        {...props}
      />
    </RidePageContextProvider>
  </NewRidePageContextProvider>
);
