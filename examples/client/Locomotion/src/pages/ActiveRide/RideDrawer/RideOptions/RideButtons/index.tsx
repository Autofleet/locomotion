import React, {
  useContext, useState, useEffect, useCallback,
} from 'react';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { ThemeContext } from 'styled-components';
import { Animated } from 'react-native';
import { isCashPaymentMethod, isOfflinePaymentMethod } from '../../../../../lib/ride/utils';
import DatePickerPoppup from '../../../../../popups/DatePickerPoppup';
import FutureBookingButton from './FutureBookingButton';
import {
  Container, RowContainer, ButtonContainer, ButtonText, StyledButton, HALF_WIDTH,
  PickerDate, PickerTimeRange, PickerTitle, ErrorText, ButtonContainerWithError, ButtonWithError,
} from './styled';
import { RidePageContext } from '../../../../../context/newRideContext';
import NoteButton from '../../../../../Components/GenericRideButton';
import i18n from '../../../../../I18n';
import plus from '../../../../../assets/bottomSheet/plus.svg';
import editNote from '../../../../../assets/bottomSheet/edit_note.svg';
import PaymentButton from './PaymentButton';
import PaymentsContext from '../../../../../context/payments';
import { PaymentMethodInterface } from '../../../../../context/payments/interface';
import { RideStateContextContext } from '../../../../../context/ridePageStateContext';
import { popupNames } from '../utils';
import { BS_PAGES } from '../../../../../context/ridePageStateContext/utils';
import cashPaymentMethod from '../../../../../pages/Payments/cashPaymentMethod';
import offlinePaymentMethod from '../../../../../pages/Payments/offlinePaymentMethod';
import { getFutureRideMaxDate, getFutureRideMinDate } from '../../../../../context/newRideContext/utils';
import settings from '../../../../../context/settings';
import SETTINGS_KEYS from '../../../../../context/settings/keys';
import { PAYMENT_METHODS, paymentMethodToIconMap } from '../../../../../pages/Payments/consts';
import PassengersCounter from './PassengersCounter';
import ErrorPopup from '../../../../../popups/TwoButtonPopup';
import { capitalizeFirstLetter, getPaymentMethod } from '../../../../../pages/Payments/cardDetailUtils';

const POOLING_TYPES = {
  NO: 'no',
  ACTIVE: 'active',
  PASSIVE: 'passive',
};

const TIME_WINDOW_CHANGE_HIGHLIGHT_TIME_MS = 500;
interface RideButtonsProps {
    displayPassenger: boolean;
    setPopupName: (popupName: popupNames) => void;
}

const RideButtons = ({
  displayPassenger,
  setPopupName,
}: RideButtonsProps) => {
  const theme = useContext(ThemeContext);
  const {
    ride,
    chosenService,
    setUnconfirmedPickupTime,
    unconfirmedPickupTime,
    setNumberOfPassengers,
    defaultService,
  } = useContext(RidePageContext);


  const {
    changeBsPage,
  } = useContext(RideStateContextContext);
  const [pickupTimeWindow, setPickupTimeWindow] = useState(0);
  const [pickupTimeWindowChangedHighlight, setPickupTimeWindowChangedHighlight] = useState(false);
  const [highEtaPopupVisible, setHighEtaPopupVisible] = useState(false);
  const { getSettingByKey } = settings.useContainer();
  const {
    paymentMethods,
    getClientOutstandingBalanceCard,
  }: {
        paymentMethods: PaymentMethodInterface[],
        getClientOutstandingBalanceCard: () => PaymentMethodInterface | undefined,
    } = PaymentsContext.useContainer();

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isFutureRidesEnabled, setIsFutureRidesEnabled] = useState(true);
  const [minMinutesBeforeFutureRide, setMinMinutesBeforeFutureRide] = useState(null);
  const [passengersCounterError, setPassengersCounterError] = useState(false);
  const firstDate = () => moment(ride?.scheduledTo || undefined).add(ride?.scheduledTo ? 0 : (minMinutesBeforeFutureRide || 0) + 1, 'minutes').toDate();
  const [tempSelectedDate, setTempSelectedDate] = useState(firstDate());
  const paymentMethodNotAllowedOnService = chosenService && ride?.paymentMethodId
    && !chosenService.allowedPaymentMethods.includes(getPaymentMethod(ride.paymentMethodId));

  const checkFutureRidesSetting = async () => {
    const futureRidesEnabled = await getSettingByKey(
      SETTINGS_KEYS.FUTURE_RIDES_ENABLED,
    );
    setIsFutureRidesEnabled(futureRidesEnabled);
  };

  const checkMinutesBeforeFutureRideSetting = async () => {
    const minutes = await getSettingByKey(SETTINGS_KEYS.MIN_MINUTES_BEFORE_FUTURE_RIDE);
    setMinMinutesBeforeFutureRide(minutes);
  };

  useEffect(() => {
    setTempSelectedDate(firstDate());
  }, [minMinutesBeforeFutureRide]);

  useEffect(() => {
    checkFutureRidesSetting();
    checkMinutesBeforeFutureRideSetting();
  }, []);

  const [animatedOpacity] = useState(new Animated.Value(0));

  const animatedStyle = {
    height: '100%',
    width: HALF_WIDTH,
    backgroundColor: '#d3eefc',
    borderRadius: 8,
    opacity: animatedOpacity,
  };

  const animateShowBg = (toValue: number, duration: number) => {
    Animated.timing(animatedOpacity, {
      toValue: ride?.scheduledTo ? toValue : 0,
      duration,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (chosenService && pickupTimeWindow !== chosenService.futurePickupWindowSizeInMinutes) {
      setPickupTimeWindow(chosenService.futurePickupWindowSizeInMinutes);
      setPickupTimeWindowChangedHighlight(true);
      animateShowBg(1, 0);
      setTimeout(() => {
        setPickupTimeWindowChangedHighlight(false);
        animateShowBg(0, 250);
      }, TIME_WINDOW_CHANGE_HIGHLIGHT_TIME_MS);
    }
  }, [chosenService]);

  const renderFutureBooking = () => {
    const close = () => {
      setIsDatePickerOpen(false);
      setTempSelectedDate(firstDate);
    };
    const afterTimeTitle = moment(tempSelectedDate).format('h:mm A');
    const pickupWindow = (chosenService || defaultService)?.futurePickupWindowSizeInMinutes;
    const beforeTimeTitle = (pickupWindow
      && moment(tempSelectedDate).add(pickupWindow, 'minutes').format('h:mm A'))
      || i18n.t('general.noTimeWindow');

    const renderDatePickerTitle = () => (
      <>
        <PickerTitle>{i18n.t('bottomSheetContent.ride.chosePickupTime')}</PickerTitle>
        <PickerDate>{moment(tempSelectedDate).format('dddd, MMM Do')}</PickerDate>
        <PickerTimeRange>{`${afterTimeTitle} - ${beforeTimeTitle}`}</PickerTimeRange>

      </>
    );


    return (
      <>
        <Animated.View style={animatedStyle} />
        <ButtonContainer
          testID="RideTimeSelector"
          onPress={() => minMinutesBeforeFutureRide && setIsDatePickerOpen(true)}
          style={{ position: 'absolute' }}
        >

          <FutureBookingButton />
        </ButtonContainer>
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
          onCancel={close}
          onConfirm={(date) => {
            if (unconfirmedPickupTime !== date.getTime()) {
              setUnconfirmedPickupTime(date.getTime());
              changeBsPage(BS_PAGES.CONFIRM_PICKUP_TIME);
            }
            close();
          }}
          onChange={date => setTempSelectedDate(date)}
        />
      </>

    );
  };

  const renderRideNotes = () => {
    const rideHasNotes = ride?.notes;
    return (
      <ButtonContainer
        testID="RideNotes"
        onPress={() => {
          setPopupName('notes');
        }}
        style={{ width: isFutureRidesEnabled ? HALF_WIDTH : '100%' }}
      >
        <NoteButton
          icon={rideHasNotes ? editNote : plus}
          title={i18n.t(rideHasNotes
            ? 'bottomSheetContent.ride.notes.edit'
            : 'bottomSheetContent.ride.notes.add')}
        />
      </ButtonContainer>
    );
  };

  const paymentMethodIdToDataMap = {
    [PAYMENT_METHODS.CASH]: cashPaymentMethod,
    [PAYMENT_METHODS.OFFLINE]: offlinePaymentMethod,
  };
  const renderPaymentButton = () => {
    const { offlinePaymentText, loadOfflinePaymentText } = PaymentsContext.useContainer();
    useEffect(() => {
      loadOfflinePaymentText();
    }, []);
    const ridePaymentMethodId = ride?.paymentMethodId || '';
    const selectedPaymentMethod:
     PaymentMethodInterface | undefined = paymentMethodIdToDataMap[ridePaymentMethodId]
      || paymentMethods.find(pm => pm.id === ridePaymentMethodId);

    const getSelectedPaymentMethodTitle = () : string => {
      if (isCashPaymentMethod(selectedPaymentMethod)) {
        return i18n.t('payments.cash');
      }
      if (isOfflinePaymentMethod(selectedPaymentMethod)) {
        return offlinePaymentText;
      }

      return selectedPaymentMethod?.name || i18n.t('bottomSheetContent.ride.addPayment');
    };
    const pureButton = () => (
      <ButtonContainer
        error={paymentMethodNotAllowedOnService}
        testID="RidePayment"
        onPress={() => {
          setPopupName('payment');
        }}
        style={{ width: displayPassenger ? HALF_WIDTH : '100%' }}
      >
        <PaymentButton
          brand={selectedPaymentMethod?.brand}
          icon={paymentMethodToIconMap[selectedPaymentMethod?.id]}
          title={getSelectedPaymentMethodTitle()}
          id={selectedPaymentMethod?.id}
          invalid={paymentMethodNotAllowedOnService}
        />
      </ButtonContainer>
    );

    const ridePaymentMethod = ride?.paymentMethodId ? getPaymentMethod(ride.paymentMethodId) : '';
    const getTypeText = () => {
      if (isOfflinePaymentMethod(selectedPaymentMethod)) {
        return offlinePaymentText;
      }
      return capitalizeFirstLetter(ridePaymentMethod);
    };
    return (
      <>
        {paymentMethodNotAllowedOnService
          ? (
            <ButtonWithError
              errorText={i18n.t('bottomSheetContent.ride.paymentMethodNotAllowedOnService', {
                type: getTypeText(),
              })}
            >
              {pureButton()}
            </ButtonWithError>
          )
          : pureButton() }
      </>
    );
  };


  useEffect(() => {
    if (!chosenService || chosenService?.pooling === POOLING_TYPES.NO) {
      setNumberOfPassengers(null);
      setPassengersCounterError(false);
    }
  }, [chosenService]);

  const allowRideOrderIfNoMatchedVehicles = chosenService?.allowRideOrderIfNoVehiclesMatched;

  const isSelectButtonDisabled = () => (
    !chosenService || !(chosenService?.isHighEtaAsapRide ? allowRideOrderIfNoMatchedVehicles : chosenService)
    || !!getClientOutstandingBalanceCard() || passengersCounterError || paymentMethodNotAllowedOnService
  );

  const selectButtonText = () => {
    if (chosenService?.isHighEtaAsapRide) {
      return i18n.t(allowRideOrderIfNoMatchedVehicles ? 'bottomSheetContent.ride.highEtaButton.enabled' : 'bottomSheetContent.ride.highEtaButton.disabled');
    }
    return i18n.t('general.select');
  };

  return (
    <>
      <Container>
        <RowContainer>
          {isFutureRidesEnabled && renderFutureBooking()}
          {displayPassenger ? <></> : renderRideNotes()}

        </RowContainer>
        <RowContainer>

          {displayPassenger && renderRideNotes()}
          {renderPaymentButton()}

        </RowContainer>
        <RowContainer>

          {chosenService && chosenService?.pooling !== POOLING_TYPES.NO
            ? (
              <PassengersCounter
                service={chosenService}
                onSelect={setNumberOfPassengers}
                onError={setPassengersCounterError}
              />
            ) : null}

          <StyledButton
            testID="selectService"
            disabled={isSelectButtonDisabled()}
            onPress={() => {
              if (chosenService?.isHighEtaAsapRide) {
                setHighEtaPopupVisible(true);
              } else {
                changeBsPage(BS_PAGES.CONFIRM_PICKUP);
              }
            }}
          >
            <ButtonText testID="select">
              {selectButtonText().toString()}
            </ButtonText>
          </StyledButton>
        </RowContainer>
      </Container>
      <ErrorPopup
        title={i18n.t('popups.highEtaConfirm.title')}
        isVisible={highEtaPopupVisible}
        text={i18n.t('popups.highEtaConfirm.text')}
        secondText={i18n.t('popups.highEtaConfirm.back')}
        defualtText={i18n.t('popups.highEtaConfirm.submit')}
        onSecondPress={() => setHighEtaPopupVisible(false)}
        onDefaultPress={() => {
          setHighEtaPopupVisible(false);
          changeBsPage(BS_PAGES.CONFIRM_PICKUP);
        }}
      />
    </>
  );
};

export default RideButtons;
