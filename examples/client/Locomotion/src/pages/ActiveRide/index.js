import React, { useContext, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ConfirmPickup, NoPayment, NotAvailableHere } from '../../Components/BsPages';
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
import { BS_PAGES } from '../../context/ridePageStateContext/utils';
import payments from '../../context/payments';


const RidePage = ({ mapSettings }) => {
  const { initGeoService, showOutOfTerritory, currentBsPage, setCurrentBsPage } = useContext(RideStateContextContext);
  const { serviceEstimations, setServiceEstimations, initSps, requestStopPoints, requestRide } = useContext(RidePageContext);
  const { setSnapPointsState, setSnapPointIndex } = useContext(BottomSheetContext);
  const {
    clientHasValidPaymentMethods
  } = payments.useContainer();
  const BS_PAGE_TO_COMP = {
    [BS_PAGES.ADDRESS_SELECTOR]: () => (showOutOfTerritory ? (
      <NotAvailableHere onButtonPress={() => ({})} />
    ) : (
      !serviceEstimations
        ? <AddressSelector />
        : <RideOptions />
    )),
    [BS_PAGES.CONFIRM_PICKUP]: () => <ConfirmPickup initialLocation={requestStopPoints[0]} onButtonPress={() => {
      if (clientHasValidPaymentMethods()) {
        requestRide();
      } else {
        setCurrentBsPage(BS_PAGES.NO_PAYMENT);
      }
    }} />,
    [BS_PAGES.SET_LOCATION_ON_MAP]: () => <ConfirmPickup onButtonPress={() => {
      setCurrentBsPage(BS_PAGES.ADDRESS_SELECTOR);
    }} />,
    [BS_PAGES.NO_PAYMENT]: () => <NoPayment />
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

  const resetStateToAddressSelector = () => {
    setServiceEstimations(null);
    setSnapPointsState(SNAP_POINT_STATES.ADDRESS_SELECTOR);
    setCurrentBsPage(BS_PAGES.ADDRESS_SELECTOR);
  }

  const goBackToAddress = () => {
    resetStateToAddressSelector();
    bottomSheetRef.current.expand();
  };

  const backToMap = () => {
    resetStateToAddressSelector();
    initSps();
    setSnapPointIndex(0);
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
