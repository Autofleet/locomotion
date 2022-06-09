import React, {
  useContext, useEffect,
} from 'react';
import { useNavigation } from '@react-navigation/native';

import geo from '../../services/geo';
import RidePageContextProvider from '../../context/ridePageContext';
import {
  PageContainer,
} from './styled';
import Header from '../../Components/Header';
import RideDrawer from './NewRideDrawer';
import MainMap from './map';
import RideSummaryPopup from '../../popups/RideSummaryPopup';
import FutureRideCanceledPopup from '../../popups/FutureRideCanceled';
import AvailabilityContextProvider from '../../context/availability';
import BottomSheet from './RideDrawer/AddressSelector';


const RidePage = ({ menuSide, mapSettings }) => {
  const navigation = useNavigation();
  const mapRef = React.useRef();
  useEffect(() => {
    geo.init();
  }, []);

  useEffect(() => {
    geo.init();
  }, []);

  return (
    <>
      <PageContainer>
        <MainMap ref={mapRef} mapSettings={mapSettings} />
        <Header navigation={navigation} menuSide={menuSide} />
        <BottomSheet />
      </PageContainer>
    </>
  );
};

export default props => (
  <RidePageContextProvider {...props}>
    <AvailabilityContextProvider>
      <RidePage
        {...props}
      />
    </AvailabilityContextProvider>
  </RidePageContextProvider>
);
