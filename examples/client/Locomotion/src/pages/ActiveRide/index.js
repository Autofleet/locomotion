import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { PortalProvider } from '@gorhom/portal';
import {
  AppState, BackHandler, Platform, View,
} from 'react-native';
import { getPolylineList } from '../../lib/polyline/utils';
import { FutureRidesContext } from '../../context/futureRides';
import FutureRidesButton from '../../Components/FutureRidesButton';
import { RIDE_STATES, STOP_POINT_STATES, STOP_POINT_TYPES } from '../../lib/commonTypes';
import { RIDE_POPUPS } from '../../context/newRideContext/utils';
import { UserContext } from '../../context/user';
import {
  ConfirmPickup,
  NoPayment,
  NotAvailableHere,
  ConfirmingRide,
  NoAvailableVehicles,
  ActiveRide,
  LocationRequest,
  CancelRide,
  ConfirmPickupTime,
  ConfirmFutureRide,
  GenericError,
} from '../../Components/BsPages';
import { RideStateContextContext, RideStateContextContextProvider } from '../../context';
import NewRidePageContextProvider, { RidePageContext } from '../../context/newRideContext';
import BottomSheetContextProvider, { BottomSheetContext, SNAP_POINT_STATES } from '../../context/bottomSheetContext';
import {
  PageContainer, MapOverlayButtons,
} from './styled';
import Header from '../../Components/Header';
import MainMap, { ACTIVE_RIDE_MAP_PADDING } from './newMap';
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
import RideCanceledPopup from '../../popups/RideCanceledPopup';
import SquareSvgButton from '../../Components/SquareSvgButton';
import targetIcon from '../../assets/target.svg';
import OneSignal from '../../services/one-signal';
import settings from '../../context/settings';
import SETTINGS_KEYS from '../../context/settings/keys';
import { checkVersionAndForceUpdateIfNeeded } from '../../services/VersionCheck';
import TopMessage from './TopMessage';
import i18n from '../../I18n';
import BlackOverlay from '../../Components/BlackOverlay';


const BLACK_OVERLAY_SCREENS = [BS_PAGES.CANCEL_RIDE];

const RidePage = ({ mapSettings, navigation }) => {
  const { locationGranted, setLocationGranted, updatePushToken } = useContext(UserContext);
  const [addressSelectorFocus, setAddressSelectorFocus] = useState(null);
  const { getSettingByKey } = settings.useContainer();
  const mapRef = useRef();
  const bottomSheetRef = useRef(null);
  const {
    currentBsPage, changeBsPage,
  } = useContext(RideStateContextContext);
  const {
    serviceEstimations,
    setServiceEstimations,
    initSps,
    requestStopPoints,
    requestRide,
    setChosenService,
    ride,
    setRidePopup,
    ridePopup,
    updateRequestSp,
    setRide,
    setRequestStopPoints,
    tryServiceEstimations,
    selectedInputIndex,
    cleanRideState,
  } = useContext(RidePageContext);
  const {
    setIsExpanded, snapPoints, isExpanded, topBarText,
  } = useContext(BottomSheetContext);
  const {
    clientHasValidPaymentMethods,
    getClientOutstandingBalanceCard,
  } = payments.useContainer();
  const {
    futureRides,
  } = useContext(FutureRidesContext);

  const resetStateToAddressSelector = (selected = null) => {
    setServiceEstimations(null);
    setChosenService(null);
    setRide({});
    changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
    setAddressSelectorFocus(selected);
  };

  const goBackToAddress = (selected) => {
    resetStateToAddressSelector(selected);
    setTimeout(() => {
      setIsExpanded(true);
    }, 100);
    bottomSheetRef.current.expand();
  };

  const backToMap = () => {
    if ([
      BS_PAGES.SERVICE_ESTIMATIONS,
      BS_PAGES.CONFIRM_FUTURE_RIDE,
      BS_PAGES.ACTIVE_RIDE,
    ].includes(currentBsPage)) {
      resetStateToAddressSelector();
      initSps();
    } else if (serviceEstimations || currentBsPage === BS_PAGES.CONFIRM_PICKUP_TIME) {
      changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
    } else {
      // sorry
      setAddressSelectorFocus(selectedInputIndex === 0
        ? STOP_POINT_TYPES.STOP_POINT_PICKUP
        : STOP_POINT_TYPES.STOP_POINT_DROPOFF);
      setTimeout(() => {
        setIsExpanded(true);
      }, 100);
      bottomSheetRef.current.expand();
      changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
    }
  };

  const BS_PAGE_TO_COMP = {
    [BS_PAGES.CONFIRM_FUTURE_RIDE]: () => (
      <ConfirmFutureRide
        onButtonPress={backToMap}
      />
    ),
    [BS_PAGES.CANCEL_RIDE]: () => (
      <CancelRide />
    ),
    [BS_PAGES.SERVICE_ESTIMATIONS]: () => (
      <RideOptions />
    ),
    [BS_PAGES.CONFIRM_PICKUP_TIME]: () => (
      <ConfirmPickupTime />
    ),
    [BS_PAGES.LOCATION_REQUEST]: () => (
      <LocationRequest
        onSecondaryButtonPress={() => goBackToAddress(STOP_POINT_TYPES.STOP_POINT_PICKUP)}
      />
    ),
    [BS_PAGES.GENERIC_ERROR]: () => (
      <GenericError />
    ),
    [BS_PAGES.NOT_IN_TERRITORY]: () => (
      <NotAvailableHere
        fullWidthButtons
        onButtonPress={() => {
          goBackToAddress();
        }}
      />
    ),
    [BS_PAGES.ADDRESS_SELECTOR]: () => (
      <AddressSelector addressSelectorFocus={addressSelectorFocus} />
    ),
    [BS_PAGES.CONFIRM_PICKUP]: () => (
      <ConfirmPickup
        isConfirmPickup
        initialLocation={requestStopPoints[0]}
        onButtonPress={(pickupLocation) => {
          if (clientHasValidPaymentMethods() || ride.paymentMethodId === 'cash') {
            requestRide(pickupLocation);
          } else {
            changeBsPage(BS_PAGES.NO_PAYMENT);
          }
        }}
      />
    ),
    [BS_PAGES.SET_LOCATION_ON_MAP]: () => (
      <ConfirmPickup onButtonPress={(sp) => {
        updateRequestSp(sp);
        changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
        setTimeout(() => {
          setIsExpanded(true);
        }, 100);
      }}
      />
    ),
    [BS_PAGES.NO_PAYMENT]: () => <NoPayment />,
    [BS_PAGES.CONFIRMING_RIDE]: () => <ConfirmingRide />,
    [BS_PAGES.NO_AVAILABLE_VEHICLES]: () => (
      <NoAvailableVehicles
        onButtonPress={() => {
          tryServiceEstimations();
          changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
        }}
      />
    ),
    [BS_PAGES.ACTIVE_RIDE]: () => <ActiveRide />,
  };
  const focusCurrentLocation = async () => {
    if ([RIDE_STATES.ACTIVE, RIDE_STATES.DISPATCHED].includes(ride.state)) {
      const currentStopPoint = (ride.stopPoints || []).find(sp => sp.state === STOP_POINT_STATES.PENDING);
      const coords = getPolylineList(currentStopPoint, ride);
      mapRef.current.fitToCoordinates(coords, {
        animated: true,
        edgePadding: ACTIVE_RIDE_MAP_PADDING,
      });
    } else {
      const location = await getPosition();
      const { coords } = (location || DEFAULT_COORDS);
      mapRef.current.animateToRegion({
      // I really don't know why this is needed, but it works
        latitude: coords.latitude - parseFloat(50) / 10000,
        longitude: coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }, 1000);
    }
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
    if (!ride.id) {
      focusCurrentLocation();
    }
  }, [locationGranted]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (serviceEstimations) {
          resetStateToAddressSelector();
          return true;
        }
        return false;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const versionCheck = async () => {
    const minAppVersion = await getSettingByKey(
      SETTINGS_KEYS.MIN_APP_VERSION,
    );

    await checkVersionAndForceUpdateIfNeeded(minAppVersion);
  };

  const initChecks = async () => {
    await versionCheck();
    await checkLocationPermission();
  };

  useEffect(() => {
    initChecks();
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        nextAppState === 'active'
      ) {
        initChecks();
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

  const getRequestSpsFromRide = () => ride.stopPoints.map(sp => ({
    id: sp.id,
    lat: sp.lat,
    lng: sp.lng,
    streetAddress: sp.description,
    description: sp.description,
    type: sp.type,
  }));

  useEffect(() => {
    if (bottomSheetRef && bottomSheetRef.current) {
      if (isExpanded) {
        bottomSheetRef.current.expand();
      } else {
        bottomSheetRef.current.collapse();
      }
    }
  }, [isExpanded]);

  useEffect(() => {
    OneSignal.init();
    updatePushToken();
  }, []);

  const MESSAGE_MAP = {
    OUTSTANDING_BALANCE: {
      text: () => {
        const creditCard = getClientOutstandingBalanceCard();
        return i18n.t('activeRide.topMessage.outstandBalanceCreditCard', {
          name: creditCard.name,
        });
      },
      condition: () => {
        const creditCard = getClientOutstandingBalanceCard();
        return creditCard && currentBsPage === BS_PAGES.SERVICE_ESTIMATIONS;
      },
    },
    PRECEDING_STOPS: {
      condition: () => ride?.stopPoints && ride?.stopPoints[0]?.precedingStops?.length,
      text: () => i18n.t('activeRide.topMessage.precedingStops'),
    },
  };

  const topMessageKey = Object.keys(MESSAGE_MAP).find(key => MESSAGE_MAP[key].condition());
  const topMessage = MESSAGE_MAP[topMessageKey];

  return (
    <PageContainer>
      <PortalProvider>
        <MainMap
          ref={mapRef}
          mapSettings={mapSettings}
        />
        {serviceEstimations || currentBsPage === BS_PAGES.SET_LOCATION_ON_MAP
          ? (
            <>
              <Header
                icon={backArrow}
                onPressIcon={backToMap}
              >

                <StopPointsViewer goBackToAddressSelector={goBackToAddress} />
              </Header>
              {topMessage ? <TopMessage text={topMessage.text()} /> : null}
            </>
          )
          : (
            <>
              <Header
                icon={hamburgerIcon}
                onPressIcon={navigation.openDrawer}
              />
              {topMessage ? <TopMessage text={topMessage.text()} /> : null}
            </>
          )}
        <MapOverlayButtons
          style={{
            marginBottom: topBarText ? 40 : 0,
            bottom: parseFloat(snapPoints[0]) + 25,
          }}
        >
          {currentBsPage === BS_PAGES.ADDRESS_SELECTOR
        && !isExpanded && futureRides.length ? (
          <FutureRidesButton />
            ) : <View />}
          {!isExpanded && locationGranted && (
            <SquareSvgButton
              noLoader
              onPress={focusCurrentLocation}
              icon={targetIcon}
              style={Platform.OS === 'android' ? { shadowColor: '#000' } : {}}
            />
          )}
        </MapOverlayButtons>
        <BottomSheet
          ref={bottomSheetRef}
          focusCurrentLocation={focusCurrentLocation}
        >
          {
BS_PAGE_TO_COMP[currentBsPage] ? BS_PAGE_TO_COMP[currentBsPage]() : null
          }
        </BottomSheet>
        {BLACK_OVERLAY_SCREENS.includes(currentBsPage) ? <BlackOverlay /> : null}
        <RideCanceledPopup
          isVisible={ridePopup === RIDE_POPUPS.RIDE_CANCELED_BY_DISPATCHER}
          onCancel={() => {
            backToMap();
            setRidePopup(null);
            cleanRideState();
          }}
          onSubmit={() => {
            changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
            setRidePopup(null);
            const sps = getRequestSpsFromRide();
            setRequestStopPoints(sps);
            cleanRideState(false);
          }
        }
        />
      </PortalProvider>
    </PageContainer>
  );
};

export default props => (
  <AvailabilityContextProvider>
    <RidePage
      {...props}
    />
  </AvailabilityContextProvider>
);
