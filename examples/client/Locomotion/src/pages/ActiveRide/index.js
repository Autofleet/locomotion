import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import Toast from 'react-native-toast-message';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import {
  AppState, BackHandler, Platform, View, Dimensions,
} from 'react-native';
import { Portal } from '@gorhom/portal';
import Config from 'react-native-config';
import { distance, point } from '@turf/turf';
import { isCardPaymentMethod } from '../../lib/ride/utils';
import networkInfo from '../../services/networkInfo';
import AFToast from '../../Components/Toast';
import * as navigationService from '../../services/navigation';
import { MAIN_ROUTES } from '../routes';
import { getPolylineList } from '../../lib/polyline/utils';
import { FutureRidesContext } from '../../context/futureRides';
import FutureRidesButton from '../../Components/FutureRidesButton';
import {
  PAYMENT_STATES, RIDE_STATES, STOP_POINT_STATES, STOP_POINT_TYPES,
} from '../../lib/commonTypes';
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
  Loading,
} from '../../Components/BsPages';
import { RideStateContextContext, RideStateContextContextProvider } from '../../context';
import { RidePageContext } from '../../context/newRideContext';
import { fetchRides } from '../../context/newRideContext/api';
import BottomSheetContextProvider, { BottomSheetContext, SNAP_POINT_STATES } from '../../context/bottomSheetContext';
import {
  PageContainer, MapOverlayButtons, LocationMarkerContainer, PickupTextContainer, PickupText, LocationMarker,
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
import settings from '../../context/settings';
import SETTINGS_KEYS from '../../context/settings/keys';
import { checkVersionAndForceUpdateIfNeeded } from '../../services/VersionCheck';
import TopMessage from './TopMessage';
import i18n from '../../I18n';
import BlackOverlay from '../../Components/BlackOverlay';
import { PAYMENT_METHODS } from '../Payments/consts';
import { MessagesContext } from '../../context/messages';
import alertIcon from '../../assets/warning.svg';
import { rideHistoryContext } from '../../context/rideHistory';
import SafeView from '../../Components/SafeView';
import CancellationReasonsPopup from '../../popups/CancellationReasonsPopup';
import VirtualStationsProvider, { VirtualStationsContext } from '../../context/virtualStationsContext';
import Mixpanel from '../../services/Mixpanel';

const BLACK_OVERLAY_SCREENS = [BS_PAGES.CANCEL_RIDE];

const RidePage = ({ mapSettings, navigation }) => {
  const {
    locationGranted, setLocationGranted,
  } = useContext(UserContext);

  const [pickupChanged, setPickupChanged] = useState(false);
  const [topMessage, setTopMessage] = useState(null);
  const { getSettingByKey } = settings.useContainer();

  const mapRef = useRef();
  const bottomSheetRef = useRef(null);

  const {
    currentBsPage, changeBsPage, setIsDraggingLocationPin, isDraggingLocationPin,
  } = useContext(RideStateContextContext);
  const isChooseLocationOnMap = [BS_PAGES.CONFIRM_PICKUP, BS_PAGES.SET_LOCATION_ON_MAP]
    .includes(currentBsPage) && !isStationsEnabled;
  const { checkMessagesForToast } = useContext(MessagesContext);
  const { isStationsEnabled } = useContext(VirtualStationsContext);

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
    setSelectedInputIndex,
    cleanRideState,
    updateRide,
    clearRequestSp,
    setUnconfirmedPickupTime,
    lastSelectedLocation,
    saveSelectedLocation,
    reverseLocationGeocode,
  } = useContext(RidePageContext);
  const {
    setIsExpanded, snapPoints, isExpanded, topBarProps,
  } = useContext(BottomSheetContext);
  const {
    clientHasValidPaymentMethods,
    getClientOutstandingBalanceCard,
    loadOutstandingBalanceRide,
    loadCustomer,
    hasOutstandingPayment,
  } = payments.useContainer();
  const {
    futureRides,
  } = useContext(FutureRidesContext);
  const isSpInputEmpty = sp => !sp?.lat || !sp?.lng;
  const prevRequestStopPoints = useRef(requestStopPoints.length);
  useEffect(() => {
    if (requestStopPoints.length > prevRequestStopPoints.current.length) {
      setSelectedInputIndex(requestStopPoints.length - 1);
    } else {
      const newFocusedSp = requestStopPoints[selectedInputIndex];
      if (!isSpInputEmpty(newFocusedSp)) {
        setSelectedInputIndex(requestStopPoints.findIndex(sp => isSpInputEmpty(sp)));
      }
    }
    prevRequestStopPoints.current = requestStopPoints;
  }, [requestStopPoints]);
  const resetStateToAddressSelector = (selectedIndex = null) => {
    setServiceEstimations(null);
    setChosenService(null);
    setRide({});
    changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
    setSelectedInputIndex(selectedIndex);
    if (isStationsEnabled) {
      clearRequestSp(selectedIndex);
    }
  };

  const goBackToAddress = (selectedIndex, expand = true) => {
    resetStateToAddressSelector(selectedIndex);
    if (expand) {
      setTimeout(() => {
        setIsExpanded(true);
        bottomSheetRef.current.expand();
      }, 100);
    }
  };

  const backToMap = () => {
    if ([
      BS_PAGES.SERVICE_ESTIMATIONS,
      BS_PAGES.CONFIRM_FUTURE_RIDE,
      BS_PAGES.ACTIVE_RIDE,
      BS_PAGES.NO_AVAILABLE_SERVICES,
    ].includes(currentBsPage)) {
      resetStateToAddressSelector();
      initSps();
    } else if (serviceEstimations || currentBsPage === BS_PAGES.CONFIRM_PICKUP_TIME) {
      changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
    } else {
      setTimeout(() => {
        setIsExpanded(true);
      }, 100);
      bottomSheetRef.current.expand();
      changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
    }
  };

  const BS_PAGE_TO_COMP = {
    [BS_PAGES.LOADING]: () => (
      <Loading />
    ),
    [BS_PAGES.CONFIRM_FUTURE_RIDE]: () => (
      <ConfirmFutureRide
        onButtonPress={() => {
          setUnconfirmedPickupTime(null);
          backToMap();
        }}
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
        onSecondaryButtonPress={() => goBackToAddress(0)}
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
    [BS_PAGES.PICKUP_NOT_IN_TERRITORY]: () => (
      <NotAvailableHere
        fullWidthButtons
        SubTitleText={i18n.t('bottomSheetContent.notAvailableHere.pickupSubTitleText', {
          appName: Config.OPERATION_NAME,
        })}
        onButtonPress={() => {
          goBackToAddress(0);
        }}
      />
    ),
    [BS_PAGES.ADDRESS_SELECTOR]: () => (
      <AddressSelector addressSelectorFocusIndex={selectedInputIndex} />
    ),
    [BS_PAGES.CONFIRM_PICKUP]: () => (
      <ConfirmPickup
        isConfirmPickup
        initialLocation={requestStopPoints[0]}
        onButtonPress={(pickupLocation) => {
          const { paymentMethodId } = ride;
          if (clientHasValidPaymentMethods() || !isCardPaymentMethod({ id: paymentMethodId })) {
            requestRide(pickupLocation);
          } else {
            changeBsPage(BS_PAGES.NO_PAYMENT);
          }
        }}
      />
    ),
    [BS_PAGES.SET_LOCATION_ON_MAP]: () => (
      <ConfirmPickup onButtonPress={(sp) => {
        updateRequestSp(sp, selectedInputIndex);
      }}
      />
    ),
    [BS_PAGES.NO_PAYMENT]: () => <NoPayment />,
    [BS_PAGES.CONFIRMING_RIDE]: () => <ConfirmingRide />,
    [BS_PAGES.NO_AVAILABLE_SERVICES]: () => (
      <NoAvailableVehicles
        onButtonPress={() => {
          backToMap();
        }}
        ButtonText={i18n.t('bottomSheetContent.noAvailableVehicles.buttonText2')}
      />
    ),
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
  const updateLocationOnMapData = async (lat, lng) => {
    const spData = await reverseLocationGeocode(lat, lng);
    if (spData) {
      saveSelectedLocation(spData);
      setPickupChanged(true);
      Mixpanel.setEvent('Change stop point location', {
        gesture_type: 'drag_map',
        screen: currentBsPage,
        ...spData,
        lat,
        lng,
      });
    }
  };
  const focusCurrentLocation = async () => {
    let coords;
    if ([RIDE_STATES.ACTIVE, RIDE_STATES.DISPATCHED].includes(ride.state)) {
      const currentStopPoint = (ride.stopPoints || [])
        .find(sp => sp.state === STOP_POINT_STATES.PENDING);
      if (currentStopPoint) {
        coords = getPolylineList(currentStopPoint, ride);
        mapRef.current.fitToCoordinates(coords, {
          animated: true,
          edgePadding: ACTIVE_RIDE_MAP_PADDING,
        });
      }
    } else {
      let deltas = {
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      };
      if (currentBsPage === BS_PAGES.CONFIRM_PICKUP) {
        deltas = {
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        };
      }
      setIsDraggingLocationPin(true);
      const location = await getPosition();
      ({ coords } = (location || DEFAULT_COORDS));
      const animateTime = 1000;
      mapRef.current.animateToRegion({
        latitude: parseFloat(coords.latitude),
        longitude: parseFloat(coords.longitude),
        ...deltas,
      }, animateTime);
      await updateLocationOnMapData(coords.latitude, coords.longitude);
    }
    return coords;
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
    if (locationGranted !== undefined && !ride.id) {
      focusCurrentLocation();
    }
  }, [locationGranted]);

  useEffect(() => {
    loadCustomer();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (serviceEstimations) {
          resetStateToAddressSelector();
          return true;
        }
        return false;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      if (!currentBsPage === BS_PAGES.SERVICE_ESTIMATIONS) {
        focusCurrentLocation();
      }

      return () => backHandler.remove();
    }, [serviceEstimations]),
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
    await checkMessagesForToast();
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
    if (currentBsPage === BS_PAGES.CONFIRM_PICKUP) {
      setPickupChanged(false);
    }
  }, [currentBsPage]);

  useEffect(() => {
    prepareTopMessage();
  }, [hasOutstandingPayment, ride?.stopPoints && ride?.stopPoints[0]?.precedingStops?.length]);

  const prepareTopMessage = async () => {
    const MESSAGE_MAP = {
      OUTSTANDING_BALANCE: {
        text: () => i18n.t('activeRide.topMessage.outstandBalanceCreditCard'),
        condition: () => hasOutstandingPayment,
        title: i18n.t('activeRide.topMessage.outstandBalanceTitle'),
        titleIcon: alertIcon,
        buttonText: i18n.t('activeRide.topMessage.outstandBalanceButton'),
        onClick: async () => {
          const rejectedRide = await loadOutstandingBalanceRide();
          navigationService.navigate(MAIN_ROUTES.COMPLETED_RIDE_OVERVIEW_PAGE, {
            rideId: rejectedRide.rideId,
          });
        },
      },
      PRECEDING_STOPS: {
        condition: () => ride?.stopPoints && ride?.stopPoints[0]?.precedingStops?.length,
        text: () => i18n.t('activeRide.topMessage.precedingStops'),
      },
    };

    const topMessageKey = Object.keys(MESSAGE_MAP).find(key => MESSAGE_MAP[key].condition());
    setTopMessage(MESSAGE_MAP[topMessageKey]);
  };

  const onCancellationReasonsAction = () => {
    setRidePopup(null);
    cleanRideState();
  };

  const onPressTargetIcon = async () => {
    const coords = await focusCurrentLocation();
    const lat = coords?.latitude;
    const lng = coords?.longitude;
    Mixpanel.clickEvent('Target Icon',
      { currentPage: currentBsPage, lat, lng });
  };


  const onRegionChangeComplete = async (event) => {
    if (isChooseLocationOnMap) {
      const { latitude, longitude } = event;
      const lat = latitude.toFixed(6);
      const lng = longitude.toFixed(6);
      const [pickup] = requestStopPoints;
      const finalStopPoint = lastSelectedLocation || pickup;
      const sourcePoint = point([finalStopPoint.lng, finalStopPoint.lat]);
      const destinationPoint = point([lng, lat]);
      const changeDistance = distance(sourcePoint, destinationPoint, { units: 'meters' });
      if (changeDistance < 5 && networkInfo.isConnectionAvailable()) {
        setIsDraggingLocationPin(false);
        return;
      }
      await updateLocationOnMapData(lat, lng);
    }
  };
  return (
    <PageContainer>
      <MainMap
        onRegionChangeComplete={onRegionChangeComplete}
        ref={mapRef}
        mapSettings={mapSettings}
      />
      {isChooseLocationOnMap && (
      <LocationMarkerContainer
        pointerEvents="none"
      >

        <PickupTextContainer
          hide={currentBsPage !== BS_PAGES.CONFIRM_PICKUP
          || isDraggingLocationPin}
        >
          <PickupText>{pickupChanged ? i18n.t('map.pickupChanged') : i18n.t('map.pickupHere')}</PickupText>
        </PickupTextContainer>
        <LocationMarker />
      </LocationMarkerContainer>
      )}
      {serviceEstimations || currentBsPage === BS_PAGES.SET_LOCATION_ON_MAP
        ? (
          <SafeView>
            <Header
              icon={backArrow}
              onPressIcon={backToMap}
            >
              {currentBsPage !== BS_PAGES.CONFIRM_PICKUP
                ? <StopPointsViewer goBackToAddressSelector={goBackToAddress} />
                : <></>}
            </Header>
            {topMessage ? (
              <TopMessage
                text={topMessage.text()}
                title={topMessage.title}
                button={topMessage.buttonText}
                onPress={topMessage.onClick}
                icon={topMessage.titleIcon}
              />
            ) : null}
          </SafeView>
        )
        : (
          <SafeView>
            <Header
              testID="profileDataHamburger"
              icon={hamburgerIcon}
              onPressIcon={navigation.openDrawer}
            />
            {topMessage ? (
              <TopMessage
                text={topMessage.text()}
                title={topMessage.title}
                button={topMessage.buttonText}
                onPress={topMessage.onClick}
                icon={topMessage.titleIcon}
              />
            ) : null}
          </SafeView>
        )}
      <MapOverlayButtons
        style={{
          marginBottom: topBarProps.text ? 40 : 0,
          bottom: parseFloat(snapPoints[0]) + 25,
        }}
      >
        {currentBsPage === BS_PAGES.ADDRESS_SELECTOR
        && !isExpanded && futureRides.length && !ride.id ? (
          <FutureRidesButton />
          ) : <View />}
        {!isExpanded && locationGranted && (
        <SquareSvgButton
          noLoader
          onPress={onPressTargetIcon}
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
      <Portal>
        <RideCanceledPopup
          isVisible={ridePopup === RIDE_POPUPS.RIDE_CANCELED_BY_DISPATCHER}
          onCancel={() => {
            navigationService.navigate(MAIN_ROUTES.HOME);
            backToMap();
            setRidePopup(null);
            cleanRideState();
          }}
          onSubmit={() => {
            navigationService.navigate(MAIN_ROUTES.HOME);
            changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
            setRidePopup(null);
            const sps = getRequestSpsFromRide();
            setRequestStopPoints(sps);
            cleanRideState(false);
          }
        }
        />
        <CancellationReasonsPopup
          isVisible={ridePopup === RIDE_POPUPS.CANCELLATION_REASON}
          onCancel={onCancellationReasonsAction}
          onSubmit={onCancellationReasonsAction}
        />
      </Portal>
      <Toast
        config={{
          tomatoToast: props => (
            <AFToast
              {...props}
            />
          ),
        }}
      />
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
