import React, { useContext, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ConfirmPickup, NotAvailableHere } from '../../Components/BsPages';
import { RideStateContextContext, RidePageContextProvider } from '../../context';
import NewRidePageContextProvider, { RidePageContext } from '../../context/newRideContext';
import BottomSheetContextProvider, { BottomSheetContext, SNAP_POINT_STATES } from '../../context/bottomSheetContext';
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


const RidePage = ({ mapSettings }) => {
  const { initGeoService, showOutOfTerritory, currentBsPage } = useContext(RideStateContextContext);
  const { serviceEstimations, setServiceEstimations, initSps } = useContext(RidePageContext);
  const { setSnapPointsState, setSnapPointIndex } = useContext(BottomSheetContext);
  const BS_PAGE_TO_COMP = {
    main: () => (showOutOfTerritory ? (
      <NotAvailableHere onButtonPress={() => ({})} />
    ) : (
      !serviceEstimations
        ? <AddressSelector />
        : <RideOptions />
    )),
    selectLocationOnMap: () => <ConfirmPickup />,
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

  const goBackToAddress = () => {
    setServiceEstimations(null);
    setSnapPointsState(SNAP_POINT_STATES.ADDRESS_SELECTOR);
    bottomSheetRef.current.expand();
  };

  const backToMap = () => {
    setServiceEstimations(null);
    initSps();
    setSnapPointIndex(0);
    setSnapPointsState(SNAP_POINT_STATES.ADDRESS_SELECTOR);
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
          />
        )
        : (
          <Header
            icon={backArrow}
            onPressIcon={backToMap}
          >
            <StopPointsViewer goBackToAddressSelector={goBackToAddress} />
          </Header>
        )}
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
