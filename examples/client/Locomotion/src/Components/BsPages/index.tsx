import React, {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import {
  Linking, Platform, Text, View,
} from 'react-native';
import Config from 'react-native-config';
import styled, { ThemeContext } from 'styled-components';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import CancellationReasonsProvider, { CancellationReasonsContext } from '../../context/cancellation-reasons';
import objDefault from '../../lib/objDefault';
import Mixpanel from '../../services/Mixpanel';
import GenericErrorPopup from '../../popups/GenericError';
import TextRowWithIcon from '../../Components/TextRowWithIcon';
import { FutureRidesContext } from '../../context/futureRides';
import { RIDE_STATES, STOP_POINT_TYPES } from '../../lib/commonTypes';
import SvgIcon from '../SvgIcon';
import { RidePageContext } from '../../context/newRideContext';
import SettingContext from '../../context/settings';
import SETTINGS_KEYS from '../../context/settings/keys';
import i18n from '../../I18n';
import {
  ERROR_COLOR, FONT_SIZES, FONT_WEIGHTS, getTextColorForTheme,
} from '../../context/theme';
import Button from '../Button';
import { BottomSheetContext, SNAP_POINT_STATES } from '../../context/bottomSheetContext';
import { RideStateContextContext } from '../../context/ridePageStateContext';
import { BS_PAGES } from '../../context/ridePageStateContext/utils';
import { MAIN_ROUTES } from '../../pages/routes';
import * as navigationService from '../../services/navigation';
import payments from '../../context/payments';
import errorIcon from '../../assets/error-icon.svg';
import outOfTerritoryIcon from '../../assets/bottomSheet/out_of_territory.svg';
import busyImage from '../../assets/bottomSheet/busy.svg';
import locationIcon from '../../assets/location_pin.svg';
import Loader from '../Loader';
import { MewRidePageContext } from '../..';
import timeIcon from '../../assets/calendar.svg';
import clockIcon from '../../assets/bottomSheet/clock.svg';
import ActiveRideContent from './ActiveRide';
import RoundedButton from '../RoundedButton';
import { getFutureRideMaxDate, getFutureRideMinDate, RIDE_POPUPS } from '../../context/newRideContext/utils';
import { PAYMENT_METHODS } from '../../pages/Payments/consts';
import DatePickerPoppup from '../../popups/DatePickerPoppup';
import { VirtualStationsContext } from '../../context/virtualStationsContext';

const OtherButton = styled(Button)`
  background-color: ${({ warning, theme }) => (warning ? ERROR_COLOR : theme.primaryColor)};
  height: 50px;
  border-radius: 8px;
`;

const SecondaryButton = styled(Button).attrs({ noBackground: true })`
  height: 50px;
  border-radius: 8px;
  border: ${({ warning }) => (warning ? `2px solid ${ERROR_COLOR}` : 'none')};
`;

const Container = styled(SafeAreaView)`
  width: 100%;
  padding: 0px 20px;
  height: 100%;
`;

const MainContent = styled(View)`
  flex: 1;
  width: 100%;
  margin-bottom: 5px;
`;

const CardText = styled(View)`
`;

const ImageContainer = styled(View)`
  justify-content: center;
  align-items: center;
`;

const TitleContainer = styled(View)`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
`;

const Title = styled(Text)`
  padding-bottom: 3px;
  ${FONT_SIZES.H1}
  ${FONT_WEIGHTS.MEDIUM}
  color: #333;
`;

const SubTitle = styled(Text)`
  ${FONT_SIZES.H3}
  color: ${({ theme }) => theme.disabledColor};
`;

const ButtonTitle = styled(Text)`
  margin: auto;
  ${FONT_SIZES.H2}
  ${({ theme }:{ theme: any }) => `
    color: ${theme.primaryButtonTextColor}
  `};
`;

type SecondaryButtonTitleInterface = {
  warning: boolean | undefined;
}
const SecondaryButtonTitle = styled(Text)<SecondaryButtonTitleInterface>`
  margin: auto;
  ${FONT_SIZES.H2}
  color: ${({ warning, theme }) => (warning ? '#333333' : theme.primaryColor)};
`;

const AddressInput = styled(Text)`
  margin-left: 5;
  ${FONT_SIZES.H3}
`;

const LoaderContainer = styled(View)`
  height: 20px;
  width: 100%;
  margin: auto 0;
  margin-top: 25px;
`;

const Header = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

type FooterInterface = {
  fullWidthButtons: boolean | undefined;
}
const Footer = styled(View)<FooterInterface>`
  width: 100%;
  display: flex;
  flex-direction: ${({ fullWidthButtons }) => (fullWidthButtons ? 'column' : 'row')};
  margin-bottom: ${Platform.OS === 'android'
    ? '35px' : '10px'};
  justify-content: space-between;
  align-items: center;
`;

const AddressContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  display: flex;
`;

const PickerTitle = styled(Text)`
  ${FONT_SIZES.H1};
  ${FONT_WEIGHTS.SEMI_BOLD};
  margin-bottom: 25px;
`;

const PickerDate = styled(Text)`
  ${FONT_SIZES.H3};
  ${FONT_WEIGHTS.LIGHT};
  margin-bottom: 7px;
`;

const PickerTimeRange = styled(Text)`
  ${FONT_SIZES.H1};
`;

const RIDE_STATES_TO_BS_PAGES = objDefault({
  [RIDE_STATES.PENDING]: BS_PAGES.CONFIRMING_RIDE,
  [RIDE_STATES.MATCHING]: BS_PAGES.CONFIRMING_RIDE,
  defaultValue: BS_PAGES.ACTIVE_RIDE,
});

const BsPage = ({
  onSecondaryButtonPress,
  onButtonPress,
  Image,
  children,
  titleIcon,
  TitleText,
  SubTitleText,
  ButtonText,
  SecondaryButtonText,
  isLoading,
  buttonDisabled,
  warning,
  fullWidthButtons,
}: {
  onSecondaryButtonPress?: any,
  onButtonPress: any,
  Image: any,
  children?: any,
  titleIcon?: any,
  TitleText: string,
  SubTitleText: string,
  ButtonText: string,
  SecondaryButtonText?: string,
  isLoading?: boolean;
  buttonDisabled?: boolean;
  warning?: boolean
  fullWidthButtons?: boolean;
}) => {
  const buttonWidth = fullWidthButtons ? '100%' : '48%';
  return (
    <Container edges={['bottom']}>
      <MainContent>
        <>
          {TitleText && (
          <Header>
            <CardText style={{ width: Image ? '50%' : '100%' }}>
              <TitleContainer>
                {titleIcon && <SvgIcon Svg={titleIcon} style={{ marginRight: 5 }} />}
                <Title>{TitleText}</Title>
              </TitleContainer>
              <SubTitle>{SubTitleText}</SubTitle>
            </CardText>
            {Image ? (
              <ImageContainer>
                {Image}
              </ImageContainer>
            ) : undefined}
          </Header>
          )}
          {children}
        </>
      </MainContent>
      <Footer fullWidthButtons={fullWidthButtons}>
        {ButtonText && (
        <OtherButton
          testID="bottomSheetConfirm"
          style={{ width: buttonWidth }}
          disabled={buttonDisabled}
          onPress={onButtonPress}
          isLoading={isLoading}
          warning={warning}
        >
          <ButtonTitle>{ButtonText}</ButtonTitle>
        </OtherButton>
        )}
        {SecondaryButtonText && (
        <SecondaryButton
          testID="bottomSheetSecondary"
          disabled={buttonDisabled}
          style={{ width: buttonWidth }}
          warning={warning}
          onPress={onSecondaryButtonPress}
        >
          <SecondaryButtonTitle warning={warning}>{SecondaryButtonText}</SecondaryButtonTitle>
        </SecondaryButton>
        )}
      </Footer>
    </Container>
  );
};

BsPage.defaultProps = {
  children: undefined,
  titleIcon: undefined,
  onSecondaryButtonPress: () => undefined,
  SecondaryButtonText: undefined,
  isLoading: false,
  buttonDisabled: false,
  warning: false,
  fullWidthButtons: false,
};

export default BsPage;

export const ConfirmPickupTime = (props: any) => {
  const { getSettingByKey } = SettingContext.useContainer();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [minMinutesBeforeFutureRide, setMinMinutesBeforeFutureRide] = useState<number | null>(null);
  const {
    unconfirmedPickupTime,
    updateRidePayload,
    setUnconfirmedPickupTime,
    tryServiceEstimations,
    setServiceEstimations,
    ride,
    chosenService,
    defaultService,
  } = useContext(MewRidePageContext);
  const {
    changeBsPage,
    isDraggingLocationPin,
  } = useContext(RideStateContextContext);
  const date = moment(unconfirmedPickupTime).format('ddd, MMM Do');
  const isDateToday = moment(unconfirmedPickupTime).isSame(moment(), 'day');
  const afterTime = moment(unconfirmedPickupTime).format('h:mm A');
  const windowSize = (chosenService || defaultService)?.futurePickupWindowSizeInMinutes;
  const beforeTime = (windowSize && moment(unconfirmedPickupTime).add(windowSize, 'minutes').format('h:mm A')) || i18n.t('general.noTimeWindow');
  const startDate = moment(unconfirmedPickupTime).add(unconfirmedPickupTime ? 0 : (minMinutesBeforeFutureRide || 0) + 1, 'minutes').toDate();
  const [tempSelectedDate, setTempSelectedDate] = useState(startDate);

  const checkMinutesBeforeFutureRideSetting = async () => {
    const minutes = await getSettingByKey(SETTINGS_KEYS.MIN_MINUTES_BEFORE_FUTURE_RIDE);
    setMinMinutesBeforeFutureRide(minutes);
  };
  useEffect(() => {
    checkMinutesBeforeFutureRideSetting();
  }, []);
  useEffect(() => {
    setTempSelectedDate(startDate);
  }, [minMinutesBeforeFutureRide]);

  const afterTimeTitle = moment(tempSelectedDate).format('h:mm A');
  const pickupWindowTime = (chosenService || defaultService)?.futurePickupWindowSizeInMinutes;
  const beforeTimeTitle = (pickupWindowTime
    && moment(tempSelectedDate).add(pickupWindowTime, 'minutes').format('h:mm A'))
    || i18n.t('general.noTimeWindow');
  const renderDatePickerTitle = () => (
    <>
      <PickerTitle>{i18n.t('bottomSheetContent.ride.chosePickupTime')}</PickerTitle>
      <PickerDate>{moment(tempSelectedDate).format('dddd, MMM Do')}</PickerDate>
      <PickerTimeRange>{`${afterTimeTitle} - ${beforeTimeTitle}`}</PickerTimeRange>

    </>
  );
  return (
    <BsPage
      TitleText={i18n.t('bottomSheetContent.confirmPickupTime.titleText')}
      ButtonText={i18n.t('bottomSheetContent.confirmPickupTime.buttonText')}
      fullWidthButtons
      onButtonPress={() => {
        if (ride?.scheduledTo !== unconfirmedPickupTime) {
          updateRidePayload({ scheduledTo: unconfirmedPickupTime });
          setServiceEstimations(null);
        }
        changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
      }}
      {...props}
    >
      <RoundedButton
        onPress={() => minMinutesBeforeFutureRide && setIsDatePickerOpen(true)}
        hollow
        icon={clockIcon}
        style={{
          borderColor: '#f1f2f6',
          marginBottom: 20,
        }}
      >
        {i18n.t('bottomSheetContent.confirmPickupTime.pickupTextTime', { afterTime, beforeTime })}
      </RoundedButton>
      <RoundedButton
        onPress={() => minMinutesBeforeFutureRide && setIsDatePickerOpen(true)}
        hollow
        icon={timeIcon}
        style={{
          borderColor: '#f1f2f6',
        }}
      >
        {i18n.t(`bottomSheetContent.confirmPickupTime.${isDateToday ? 'pickupTextToday' : 'pickupTextDay'}`, { date })}
      </RoundedButton>
      <DatePickerPoppup
        testID="datePicker"
        textColor="black"
        isVisible={isDatePickerOpen}
        date={tempSelectedDate}
        maximumDate={getFutureRideMaxDate()}
        minimumDate={getFutureRideMinDate((minMinutesBeforeFutureRide || 0))}
        mode="datetime"
        title={renderDatePickerTitle()}
        confirmText={i18n.t('general.select')}
        cancelText={i18n.t('general.cancel')}
        onCancel={() => setIsDatePickerOpen(false)}
        onConfirm={(newDate: Date) => {
          setUnconfirmedPickupTime(newDate.getTime());
          setIsDatePickerOpen(false);
        }}
        onChange={(newDate: Date) => setTempSelectedDate(newDate)}
      />
    </BsPage>
  );
};

export const GenericError = (props: any) => {
  const { genericErrorDetails } = useContext(BottomSheetContext);
  return (
    <BsPage
      TitleText={genericErrorDetails.titleText}
      ButtonText={genericErrorDetails.buttonText}
      SubTitleText={genericErrorDetails.subTitleText}
      onButtonPress={genericErrorDetails.buttonPress}
      SecondaryButtonText={genericErrorDetails.secondaryButtonText}
      onSecondaryButtonPress={genericErrorDetails.secondaryButtonPress}
      fullWidthButtons
      {...props}
    />
  );
};

export const LocationRequest = (props: any) => (
  <BsPage
    TitleText={i18n.t('bottomSheetContent.locationRequest.titleText')}
    ButtonText={i18n.t('bottomSheetContent.locationRequest.buttonText')}
    SecondaryButtonText={i18n.t('bottomSheetContent.locationRequest.secondaryButtonText')}
    SubTitleText={i18n.t('bottomSheetContent.locationRequest.subTitleText', { operation: Config.OPERATION_NAME })}
    onButtonPress={Linking.openSettings}
    fullWidthButtons
    {...props}
  />
);

export const CancelRide = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const { cancelRide, ride, setRidePopup } = useContext(RidePageContext);
  const { changeBsPage } = useContext(RideStateContextContext);

  return (
    <BsPage
      TitleText={i18n.t('bottomSheetContent.cancelRide.titleText')}
      ButtonText={i18n.t('bottomSheetContent.cancelRide.buttonText')}
      SubTitleText={i18n.t('bottomSheetContent.cancelRide.subTitleText')}
      SecondaryButtonText={i18n.t('bottomSheetContent.cancelRide.secondaryButtonText')}
      isLoading={isLoading}
      onButtonPress={async () => {
        try {
          setIsLoading(true);
          Mixpanel.setEvent('Trying to cancel ride');
          await cancelRide();
          setRidePopup(RIDE_POPUPS.CANCELLATION_REASON);
          changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
        } catch (e: any) {
          setShowError(true);
          setIsLoading(false);
          Mixpanel.setEvent('failed to cancel ride', { status: e?.response?.status });
        }
      }}
      onSecondaryButtonPress={() => changeBsPage(
        RIDE_STATES_TO_BS_PAGES[ride.state || RIDE_STATES.ACTIVE],
      )}
      warning
      buttonDisabled={isLoading}
      {...props}
    >
      <GenericErrorPopup
        isVisible={showError}
        closePopup={() => setShowError(false)}
      />
    </BsPage>
  );
};

export const ConfirmFutureRide = (props: any) => {
  const { newFutureRide } = useContext(FutureRidesContext);
  const { chosenService } = useContext(MewRidePageContext);

  const getTimeDisplay = () => {
    const afterTime = moment.parseZone(newFutureRide?.scheduledTo).format('h:mm A');
    const windowSize = chosenService?.futurePickupWindowSizeInMinutes;
    const beforeTime = (windowSize && moment.parseZone(newFutureRide?.scheduledTo).add(windowSize, 'minutes').format('h:mm A')) || i18n.t('general.noTimeWindow');

    const timeText = i18n.t('bottomSheetContent.confirmPickupTime.pickupTextTime', { afterTime, beforeTime });
    return <TextRowWithIcon text={timeText} icon={clockIcon} />;
  };

  const getDateDisplay = () => {
    const date = moment.parseZone(newFutureRide?.scheduledTo).format('ddd, MMM Do');
    const isDateToday = moment.parseZone(newFutureRide?.scheduledTo).isSame(moment(), 'day');

    const dateText = i18n.t(`bottomSheetContent.confirmPickupTime.${isDateToday ? 'pickupTextToday' : 'pickupTextDay'}`, { date });
    return <TextRowWithIcon text={dateText} icon={timeIcon} />;
  };

  const getPickupDisplay = () => {
    const pickup = (newFutureRide?.stopPoints || [])
      .find(sp => sp.type === STOP_POINT_TYPES.STOP_POINT_PICKUP);
    const pickupText = i18n.t('bottomSheetContent.confirmFutureRide.pickupText', { address: pickup?.description });
    return <TextRowWithIcon text={pickupText} />;
  };
  const getDropOffDisplay = () => {
    const dropOff = (newFutureRide?.stopPoints || [])
      .find(sp => sp.type === STOP_POINT_TYPES.STOP_POINT_DROPOFF);
    const dropOffText = i18n.t('bottomSheetContent.confirmFutureRide.dropOffText', { address: dropOff?.description });
    return <TextRowWithIcon text={dropOffText} />;
  };
  return (
    <BsPage
      TitleText={i18n.t('bottomSheetContent.confirmFutureRide.titleText')}
      ButtonText={i18n.t('bottomSheetContent.confirmFutureRide.buttonText')}
      fullWidthButtons
      {...props}
    >
      {getTimeDisplay()}
      {getDateDisplay()}
      {getPickupDisplay()}
      {getDropOffDisplay()}
    </BsPage>
  );
};

export const NotAvailableHere = (props: any) => {
  const { setSnapPointsState, setIsExpanded } = useContext(BottomSheetContext);
  const { primaryColor } = useContext(ThemeContext);
  useEffect(() => {
    setSnapPointsState(SNAP_POINT_STATES.NOT_IN_TERRITORY);
    setIsExpanded(false);
  }, []);

  return (
    <BsPage
      TitleText={i18n.t('bottomSheetContent.notAvailableHere.titleText')}
      ButtonText={i18n.t('bottomSheetContent.notAvailableHere.buttonText')}
      SubTitleText={i18n.t('bottomSheetContent.notAvailableHere.subTitleText', {
        appName: Config.OPERATION_NAME,
      })}
      Image={<SvgIcon Svg={outOfTerritoryIcon} height={85} width={110} fill={primaryColor} />}
      fullWidthButtons
      {...props}
    />
  );
};

export const ConfirmPickup = (props: any) => {
  const {
    lastSelectedLocation,
    getCurrentLocationAddress,
    saveSelectedLocation,
    setSelectedInputIndex,
    rideRequestLoading,
  } = useContext(RidePageContext);
  const { isDraggingLocationPin } = useContext(RideStateContextContext);
  const { setSnapPointsState } = useContext(BottomSheetContext);
  const { isStationsEnabled } = useContext(VirtualStationsContext);

  const { collapse } = useBottomSheet();
  const setInitialLocation = async () => {
    if (props.initialLocation) {
      saveSelectedLocation(props.initialLocation);
      setSelectedInputIndex(0);
    } else {
      const sp = await getCurrentLocationAddress();
      saveSelectedLocation(sp);
    }
  };

  useEffect(() => {
    collapse();
    setSnapPointsState(SNAP_POINT_STATES.CONFIRM_PICKUP);
    setInitialLocation();
  }, []);

  const titleText = props.isConfirmPickup ? 'confirmPickupTitle' : 'confirmLocationTitle';

  const renderSkeleton = useCallback(() => (
    <SkeletonContent
      containerStyle={{}}
      isLoading
      layout={[{
        flexDirection: 'row',
        width: '100%',
        paddingLeft: 5,
        paddingRight: 10,
        alignItems: 'center',
        children: [
          {
            width: '100%',
            height: 13,
          },
        ],
      }]}
    />
  ), []);

  const renderAddressContainer = useCallback(() => (
    <AddressContainer testID="pickupAddress">
      <SvgIcon Svg={locationIcon} height={20} width={10} fill={isDraggingLocationPin ? '#ADAEBA' : '#333'} />
      {isDraggingLocationPin ? renderSkeleton()
        : <AddressInput>{lastSelectedLocation?.streetAddress || i18n.t('bottomSheetContent.confirmPickup.noAddress')}</AddressInput>}
    </AddressContainer>
  ), [isDraggingLocationPin, lastSelectedLocation?.streetAddress]);

  return (
    <BsPage
      TitleText={i18n.t(`bottomSheetContent.confirmPickup.${titleText}`)}
      ButtonText={i18n.t(`bottomSheetContent.confirmPickup.${props.isConfirmPickup ? 'buttonTextWithRequest' : 'buttonText'}`)}
      SubTitleText={!isStationsEnabled ? i18n.t('bottomSheetContent.confirmPickup.subTitleText') : ''}
      isLoading={rideRequestLoading}
      fullWidthButtons
      {...props}
      onButtonPress={() => {
        if (props.onButtonPress) {
          props.onButtonPress(lastSelectedLocation);
        }
      }}
      buttonDisabled={isDraggingLocationPin || !lastSelectedLocation?.streetAddress}
    >
      {renderAddressContainer()}
    </BsPage>
  );
};

export const NoPayment = (props: any) => {
  const { setSnapPointsState } = useContext(BottomSheetContext);
  const { requestRide, ride } = useContext(RidePageContext);

  const {
    paymentMethods,
    clientHasValidPaymentMethods,
  } = payments.useContainer();

  const proceedIfPaymentMethodsAreValid = () => {
    if (clientHasValidPaymentMethods() || ride.paymentMethodId === PAYMENT_METHODS.CASH) {
      requestRide();
    }
  };

  useEffect(() => {
    setSnapPointsState(SNAP_POINT_STATES.NO_PAYMENT);
  }, []);

  useEffect(() => {
    proceedIfPaymentMethodsAreValid();
  }, [ride.paymentMethodId]);

  return (
    <BsPage
      titleIcon={errorIcon}
      TitleText={i18n.t('bottomSheetContent.noPayment.titleText')}
      ButtonText={i18n.t('bottomSheetContent.noPayment.buttonText')}
      SubTitleText={i18n.t('bottomSheetContent.noPayment.subTitleText')}
      fullWidthButtons
      onButtonPress={() => {
        navigationService.navigate(MAIN_ROUTES.PAYMENT, { rideFlow: true });
      }}
      {...props}
    />
  );
};

export const Loading = (props: any) => (
  <BsPage
    {...props}
  >
    <LoaderContainer>
      <Loader
        dark
        lottieViewStyle={{
          height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center',
        }}
        sourceProp={undefined}
      />
    </LoaderContainer>
  </BsPage>
);

export const ConfirmingRide = (props: any) => {
  const { setSnapPointsState } = useContext(BottomSheetContext);
  const { changeBsPage } = useContext(RideStateContextContext);
  const { ride, chosenService } = useContext(RidePageContext);
  const {
    getCancellationReasons,
  } = useContext(CancellationReasonsContext);
  useEffect(() => {
    setSnapPointsState(SNAP_POINT_STATES.CONFIRMING_RIDE);
  }, []);

  const TitleText = ride?.scheduledTo
    ? i18n.t('bottomSheetContent.confirmingFutureRide.titleText')
    : i18n.t('bottomSheetContent.confirmingRide.titleText');

  const windowSize = chosenService?.futurePickupWindowSizeInMinutes;
  const beforeTime = windowSize ? moment(ride.scheduledTo).add(windowSize, 'minutes').format('h:mm A') : i18n.t('general.noTimeWindow');

  const SubTitleText = ride?.scheduledTo
    ? i18n.t('bottomSheetContent.confirmingFutureRide.subTitleText',
      { date: moment(ride.scheduledTo).format('MMM D, h:mm A'), beforeTime })
    : null;
  return (
    <BsPage
      TitleText={TitleText}
      SecondaryButtonText={ride?.id ? i18n.t('bottomSheetContent.confirmingRide.secondaryButtonText') : null}
      onSecondaryButtonPress={() => {
        getCancellationReasons(ride?.id);
        changeBsPage(BS_PAGES.CANCEL_RIDE);
      }}
      SubTitleText={SubTitleText}
      fullWidthButtons
      {...props}
    >
      <LoaderContainer>
        <Loader
          dark
          lottieViewStyle={{
            height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center',
          }}
          sourceProp={undefined}
        />
      </LoaderContainer>
    </BsPage>
  );
};

export const NoAvailableVehicles = (props: any) => {
  const { setSnapPointsState } = useContext(BottomSheetContext);
  const { primaryColor } = useContext(ThemeContext);

  useEffect(() => {
    setSnapPointsState(SNAP_POINT_STATES.NO_AVAILABLE_VEHICLES);
  }, []);

  return (
    <BsPage
      TitleText={i18n.t('bottomSheetContent.noAvailableVehicles.titleText')}
      ButtonText={i18n.t('bottomSheetContent.noAvailableVehicles.buttonText')}
      SubTitleText={i18n.t('bottomSheetContent.noAvailableVehicles.subTitleText')}
      fullWidthButtons
      Image={<SvgIcon Svg={busyImage} height={85} width={140} fill={primaryColor} />}
      {...props}
    />
  );
};

export const ActiveRide = (props: any) => (
  <BsPage
    {...props}
  >
    <ActiveRideContent />
  </BsPage>
);
