import React, { useContext, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  ConfirmPickup, NoPayment, NotAvailableHere, ConfirmingRide, NoAvailableVehicles, ActiveRide,
} from '../../Components/BsPages';
import { RideStateContextContext, RideStateContextContextProvider } from '../../context';
import NewRidePageContextProvider, { RidePageContext } from '../../context/newRideContext';
import BottomSheetContextProvider, { BottomSheetContext, SNAP_POINT_STATES } from '../../context/bottomSheetContext';
import {
  PageContainer,
} from './styled';
import Header from '../../Components/Header';
import MainMap from './newMap';
import AvailabilityContextProvider from '../../context/availability';
import BottomSheet from '../../Components/BottomSheet';
import RideOptions from './RideDrawer/RideOptions';
import AddressSelector from './RideDrawer/AddressSelector';
import StopPointsViewer from '../../Components/StopPointsViewer';
import hamburgerIcon from '../../assets/hamburger.svg';
import backArrow from '../../assets/arrow-back.svg';
import { BS_PAGES } from '../../context/ridePageStateContext/utils';
import payments from '../../context/payments';
import { getPosition } from '../../services/geo';


const RidePage = ({ mapSettings }) => {
  const navigation = useNavigation();
  const mapRef = useRef();
  const bottomSheetRef = useRef(null);
  const {
    currentBsPage, changeBsPage,
  } = useContext(RideStateContextContext);
  const {
    serviceEstimations,
    setServiceEstimations,
    initSps,
    isLoading,
    requestStopPoints,
    requestRide,
    setChosenService,
  } = useContext(RidePageContext);
  const { setSnapPointsState, setIsExpanded, snapPoints } = useContext(BottomSheetContext);
  const {
    clientHasValidPaymentMethods,
  } = payments.useContainer();

  const resetStateToAddressSelector = () => {
    setServiceEstimations(null);
    setChosenService(null);
    changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
  };

  const goBackToAddress = () => {
    resetStateToAddressSelector();
    setIsExpanded(true);
    bottomSheetRef.current.expand();
  };

  const backToMap = () => {
    resetStateToAddressSelector();
    initSps();
  };

  const addressSelectorPage = () => {
    if (!isLoading && !serviceEstimations) {
      return (
        <AddressSelector />
      );
    }
    return <RideOptions />;
  };

  const BS_PAGE_TO_COMP = {
    [BS_PAGES.NOT_IN_TERRITORY]: () => (
      <NotAvailableHere onButtonPress={() => {
        goBackToAddress();
      }}
      />
    ),
    [BS_PAGES.ADDRESS_SELECTOR]: addressSelectorPage,
    [BS_PAGES.CONFIRM_PICKUP]: () => (
      <ConfirmPickup
        initialLocation={requestStopPoints[0]}
        onButtonPress={() => {
          if (clientHasValidPaymentMethods()) {
            requestRide();
          } else {
            changeBsPage(BS_PAGES.NO_PAYMENT);
          }
        }}
      />
    ),
    [BS_PAGES.SET_LOCATION_ON_MAP]: () => (
      <ConfirmPickup onButtonPress={() => {
        changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
      }}
      />
    ),
    [BS_PAGES.NO_PAYMENT]: () => <NoPayment />,
    [BS_PAGES.CONFIRMING_RIDE]: () => <ConfirmingRide />,
    [BS_PAGES.NO_AVAILABLE_VEHICLES]: () => <NoAvailableVehicles />,
    [BS_PAGES.ACTIVE_RIDE]: () => <ActiveRide />,
  };

  useEffect(() => {
    if (isLoading) {
      setSnapPointsState(SNAP_POINT_STATES.SERVICE_ESTIMATIONS);
      bottomSheetRef.current.collapse();
    }
  }, [isLoading]);

  const focusCurrentLocation = async () => {
    const { coords } = await getPosition();
    mapRef.current.animateToRegion({
      latitude: coords.latitude - (parseFloat(snapPoints[0])/10000),
      longitude: coords.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    }, 1000);
  }

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
        focusCurrentLocation={focusCurrentLocation}
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
    <RideStateContextContextProvider {...props}>
      <NewRidePageContextProvider {...props}>
        <AvailabilityContextProvider>
          <RidePage
            {...props}
          />
        </AvailabilityContextProvider>
      </NewRidePageContextProvider>
    </RideStateContextContextProvider>
  </BottomSheetContextProvider>
);
