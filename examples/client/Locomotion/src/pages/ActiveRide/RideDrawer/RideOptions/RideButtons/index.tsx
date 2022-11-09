import React, { useContext, useState, useEffect } from 'react';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { ThemeContext } from 'styled-components';
import DatePickerPoppup from '../../../../../popups/DatePickerPoppup';
import FutureBookingButton from './FutureBookingButton';
import {
  Container, RowContainer, ButtonContainer, ButtonText, StyledButton, HALF_WIDTH,
  PickerDate, PickerTimeRange, PickerTitle,
} from './styled';
import { RidePageContext } from '../../../../../context/newRideContext';
import NoteButton from '../../../../../Components/GenericRideButton';
import i18n from '../../../../../I18n';
import plus from '../../../../../assets/bottomSheet/plus.svg';
import editNote from '../../../../../assets/bottomSheet/edit_note.svg';
import creditCardIcon from '../../../../../assets/bottomSheet/credit_card_icon.svg';
import PaymentButton from './PaymentButton';
import PaymentsContext from '../../../../../context/payments';
import { PaymentMethodInterface } from '../../../../../context/payments/interface';
import { RideStateContextContext } from '../../../../../context/ridePageStateContext';
import { popupNames } from '../utils';
import { BS_PAGES } from '../../../../../context/ridePageStateContext/utils';
import cashPaymentMethod from '../../../../../pages/Payments/cashPaymentMethod';
import { getFutureRideMaxDate, getFutureRideMinDate } from '../../../../../context/newRideContext/utils';
import settings from '../../../../../context/settings';
import SETTINGS_KEYS from '../../../../../context/settings/keys';
import { getTextColorForTheme } from '../../../../../context/theme';
import { PAYMENT_METHODS } from '../../../../../pages/Payments/consts';

const TIME_WINDOW_CHANGE_HIGHLIGHT_TIME_MS = 3000;
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
  } = useContext(RidePageContext);
  const {
    changeBsPage,
  } = useContext(RideStateContextContext);
  const [pickupTimeWindow, setPickupTimeWindow] = useState(0);
  const [pickupTimeWindowChangedHighlight, setPickupTimeWindowChangedHighlight] = useState(false);
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
  const firstDate = moment(ride?.scheduledTo || undefined).add(ride?.scheduledTo ? 0 : minMinutesBeforeFutureRide, 'minutes').toDate();
  const [tempSelectedDate, setTempSelectedDate] = useState(firstDate);


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
    checkFutureRidesSetting();
    checkMinutesBeforeFutureRideSetting();
  }, []);

  useEffect(() => {
    if (chosenService && pickupTimeWindow !== chosenService.pickupWindowSizeInMinutes) {
      setPickupTimeWindow(chosenService.pickupWindowSizeInMinutes);
      setPickupTimeWindowChangedHighlight(true);
      setTimeout(() => {
        setPickupTimeWindowChangedHighlight(false);
      }, TIME_WINDOW_CHANGE_HIGHLIGHT_TIME_MS);
    }
  }, [chosenService]);

  const renderFutureBooking = () => {
    const close = () => {
      setIsDatePickerOpen(false);
      setTempSelectedDate(firstDate);
    };

    const renderDatePickerTitle = () => (
      <>
        <PickerTitle>{i18n.t('bottomSheetContent.ride.chosePickupTime')}</PickerTitle>
        <PickerDate>{moment(tempSelectedDate).format('dddd, MMM Do')}</PickerDate>
        <PickerTimeRange>
          {`${moment(tempSelectedDate).format('h:mm A')} - ${(chosenService?.pickupWindowSizeInMinutes
          && moment(tempSelectedDate).add(chosenService?.pickupWindowSizeInMinutes, 'minutes').format('h:mm A'))
          || i18n.t('general.noTimeWindow')}`}
        </PickerTimeRange>

      </>
    );
    return (
      <ButtonContainer
        testID="RideTimeSelector"
        onPress={() => minMinutesBeforeFutureRide && setIsDatePickerOpen(true)}
        highlight={ride?.scheduledTo && pickupTimeWindowChangedHighlight}
      >
        <FutureBookingButton />
        <DatePickerPoppup
          testID="datePicker"
          textColor={getTextColorForTheme()}
          isVisible={isDatePickerOpen}
          date={tempSelectedDate}
          maximumDate={getFutureRideMaxDate()}
          minimumDate={getFutureRideMinDate((minMinutesBeforeFutureRide || 0))}
          mode="datetime"
          title={renderDatePickerTitle()}
          onCancel={close}
          onConfirm={(date) => {
            if (unconfirmedPickupTime !== date.getTime()) {
              setUnconfirmedPickupTime(date.getTime());
              changeBsPage(BS_PAGES.CONFIRM_PICKUP_TIME);
              close();
            }
          }}
          onChange={date => setTempSelectedDate(date)}
        />
      </ButtonContainer>
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

  const renderPaymentButton = () => {
    const ridePaymentMethod = ride?.paymentMethodId;
    const selectedPaymentMethod:
     PaymentMethodInterface | undefined = ridePaymentMethod === PAYMENT_METHODS.CASH
       ? cashPaymentMethod
       : paymentMethods.find(pm => pm.id === ridePaymentMethod);

    return (
      <ButtonContainer
        testID="RidePayment"
        onPress={() => {
          setPopupName('payment');
        }}
        style={{ width: displayPassenger ? HALF_WIDTH : '100%' }}
      >
        <PaymentButton
          brand={selectedPaymentMethod?.brand}
          icon={creditCardIcon}
          title={selectedPaymentMethod?.name === cashPaymentMethod.name ? i18n.t('payments.cash') : (selectedPaymentMethod?.name || i18n.t('bottomSheetContent.ride.addPayment'))}
          id={selectedPaymentMethod?.id}
        />
      </ButtonContainer>
    );
  };

  return (
    <Container>
      <RowContainer>
        <>
          {isFutureRidesEnabled && renderFutureBooking()}
          {displayPassenger ? <></> : renderRideNotes()}
        </>
      </RowContainer>
      <RowContainer>
        <>
          {displayPassenger && renderRideNotes()}
          {renderPaymentButton()}
        </>
      </RowContainer>
      <StyledButton
        testID="selectService"
        disabled={!chosenService || !!getClientOutstandingBalanceCard()}
        onPress={() => {
          changeBsPage(BS_PAGES.CONFIRM_PICKUP);
        }}
      >
        <ButtonText testID="select">{i18n.t('general.select').toString()}</ButtonText>
      </StyledButton>
    </Container>
  );
};

export default RideButtons;
