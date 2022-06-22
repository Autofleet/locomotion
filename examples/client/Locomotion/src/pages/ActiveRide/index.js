import React, { useContext, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ConfirmPickup, NotAvailableHere } from '../../Components/BsPages';
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



const RidePage = ({ menuSide, mapSettings }) => {
  const { initGeoService, showOutOfTerritory, currentBsPage } = useContext(RideStateContextContext);
  const { serviceEstimations } = useContext(RidePageContext);
  const BS_PAGE_TO_COMP = {
    'main': () => (showOutOfTerritory ? (
      <NotAvailableHere onButtonPress={() => ({})} />
    ) : (
      !true
        ? <AddressSelector bottomSheetRef={bottomSheetRef} />
        : <RideOptions />
    )),
    'selectLocationOnMap': () => <ConfirmPickup />
  };

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

  return (
    <PageContainer>
      <MainMap ref={mapRef} mapSettings={mapSettings} />
      <Header navigation={navigation} menuSide={menuSide} />
      <BottomSheet
        ref={bottomSheetRef}
      >
        {
          BS_PAGE_TO_COMP[currentBsPage]()
        }
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
