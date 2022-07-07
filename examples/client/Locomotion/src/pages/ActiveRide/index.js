import React, { useContext, useEffect, useRef } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AppState } from 'react-native';
import { UserContext } from '../../context/user';
import { RIDE_STATES } from '../../lib/commonTypes';
import {
  ConfirmPickup, NoPayment, NotAvailableHere, ConfirmingRide, NoAvailableVehicles, ActiveRide, LocationRequest,
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
import geo, { DEFAULT_COORDS, getPosition } from '../../services/geo';


const RidePage = ({ mapSettings, navigation }) => {
  const mapRef = useRef();
  const appState = useRef(AppState.currentState);
  const bottomSheetRef = useRef(null);
  const { locationGranted, setLocationGranted } = useContext(UserContext);
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
    ride,
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
    return changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
  };

  const BS_PAGE_TO_COMP = {
    [BS_PAGES.SERVICE_ESTIMATIONS]: () => (
      <RideOptions />
    ),
    [BS_PAGES.LOCATION_REQUEST]: () => (
      <LocationRequest
        onSecondaryButtonPress={goBackToAddress}
      />
    ),
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
          if (clientHasValidPaymentMethods() || ride.paymentMethodId === 'cash') {
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

  useEffect(() => {
    if (currentBsPage === BS_PAGES.ACTIVE_RIDE && ride.state === RIDE_STATES.CANCELED) {
      setServiceEstimations(null);
      changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
    }
  }, [ride]);
  const focusCurrentLocation = async () => {
    const location = await getPosition();
    const { coords } = (location || DEFAULT_COORDS);
    mapRef.current.animateToRegion({
      latitude: coords.latitude - (parseFloat(snapPoints[0]) / 10000),
      longitude: coords.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    }, 1000);
  };

  const checkLocationPermission = async () => {
    const granted = await geo.checkPermission();
    setLocationGranted(granted);
  };

  useEffect(() => {
    if (locationGranted && currentBsPage === BS_PAGES.LOCATION_REQUEST) {
      changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
      bottomSheetRef.current.collapse();
    } else if (!locationGranted
      && locationGranted !== undefined
      && currentBsPage === BS_PAGES.ADDRESS_SELECTOR) {
      changeBsPage(BS_PAGES.LOCATION_REQUEST);
    }
    focusCurrentLocation();
  }, [locationGranted]);

  useEffect(() => {
    checkLocationPermission();
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        nextAppState === 'active'
      ) {
        checkLocationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      navigation.closeDrawer();
    }
  }, [isFocused]);


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
