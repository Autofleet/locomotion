import React, { useContext, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';

import { StyleSheet, View } from 'react-native';
import { NotAvailableHere } from '../../Components/BsPages';
import { RideStateContextContext, RidePageContextProvider } from '../../context';
import NewRidePageContextProvider, { RidePageContext } from '../../context/newRideContext';
import BottomSheetContextProvider from '../../context/bottomSheetContext';
import {
  PageContainer,
} from './styled';
import Header from '../../Components/Header';
import MainMap from './newMap';
import AvailabilityContextProvider from '../../context/availability';
import BottomSheet from './RideDrawer/BottomSheet';
import RideOptions from './RideDrawer/RideOptions';
import AddressSelector from './RideDrawer/AddressSelector';
import StopPointsViewer from '../../Components/StopPointsViewer';
import hamburgerIcon from '../../assets/hamburger.svg';
import backArrow from '../../assets/arrow-back.svg';

// import de from './src/I18n/en.json';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },

});


const RidePage = ({ menuSide, mapSettings }) => {
  const { initGeoService, showOutOfTerritory } = useContext(RideStateContextContext);
  const { serviceEstimations, setServiceEstimations, initSps } = useContext(RidePageContext);

  const navigation = useNavigation();
  const mapRef = useRef();
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    initGeoService();
  }, []);

  useEffect(() => {
    if (serviceEstimations) {
      bottomSheetRef.current.collapse();
    }
  }, [serviceEstimations]);

  const goBackToAddress = () => {
    setServiceEstimations(null);
    bottomSheetRef.current.expand();
  };

  const backToMap = () => {
    setServiceEstimations(null);
    initSps();
  };
  return (
    <PageContainer>
      <MainMap
        ref={mapRef}
        mapSettings={mapSettings}
      />
      {!serviceEstimations
        ? (
          <Header
            icon={hamburgerIcon}
            onPressIcon={navigation.openDrawer}
            menuSide={menuSide}
          />
        )
        : (
          <Header
            icon={backArrow}
            onPressIcon={backToMap}
            menuSide={menuSide}
          >
            <StopPointsViewer goBackToAddressSelector={goBackToAddress} />
          </Header>
        )}
      <BottomSheet
        ref={bottomSheetRef}
      >
        {showOutOfTerritory ? (
          <NotAvailableHere onButtonPress={() => ({})} />
        ) : (
          !serviceEstimations
            ? <AddressSelector />
            : <RideOptions />
        )}
      </BottomSheet>
    </PageContainer>
  );
};

export default props => (
  <BottomSheetContextProvider {...props}>
    <NewRidePageContextProvider {...props}>
      <RidePageContextProvider {...props}>
        <AvailabilityContextProvider>
          <RidePage
            {...props}
          />
        </AvailabilityContextProvider>
      </RidePageContextProvider>
    </NewRidePageContextProvider>
  </BottomSheetContextProvider>
);
