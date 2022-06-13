import React, { useContext, useEffect } from 'react';import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GeoContextContext, RidePageContextProvider } from '../../context';
import NewRidePageContextProvider from '../../context/newRideContext';
import {
  PageContainer,
} from './styled';
import Header from '../../Components/Header';
import MainMap from './map';
import AvailabilityContextProvider from '../../context/availability';
import BottomSheet from './RideDrawer/BottomSheet';
import AddressSelector from './RideDrawer/AddressSelector';

const RidePage = ({ menuSide, mapSettings }) => {
  const { initGeoService } = useContext(GeoContextContext);
  const navigation = useNavigation();
  const mapRef = React.useRef();

  useEffect(() => {
    initGeoService();
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
  <NewRidePageContextProvider {...props}>
    <RidePageContextProvider {...props}>
      <AvailabilityContextProvider>
      <RidePage
        {...props}
      />
    </AvailabilityContextProvider>
    </RidePageContextProvider>
  </NewRidePageContextProvider>
);
