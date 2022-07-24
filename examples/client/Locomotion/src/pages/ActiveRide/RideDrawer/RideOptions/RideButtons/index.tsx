import React, { useContext, useState, useEffect } from 'react';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import FutureBookingButton from './FutureBookingButton';
import {
  Container, RowContainer, ButtonContainer, ButtonText, StyledButton, HALF_WIDTH,
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

interface RideButtonsProps {
    displayPassenger: boolean;
    setPopupName: (popupName: popupNames) => void;
}

const RideButtons = ({
  displayPassenger,
  setPopupName,
}: RideButtonsProps) => {
  const {
    ride,
    chosenService,
    setUnconfirmedPickupTime,
  } = useContext(RidePageContext);
  const {
    changeBsPage,
  } = useContext(RideStateContextContext);
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

  const checkFutureRidesSetting = async () => {
    const futureRidesEnabled = await getSettingByKey(
      SETTINGS_KEYS.FUTURE_RIDES_ENABLED,
    );
    setIsFutureRidesEnabled(futureRidesEnabled);
  };

  useEffect(() => {
    checkFutureRidesSetting();
  }, []);
  const renderFutureBooking = () => {
    const close = () => {
      setIsDatePickerOpen(false);
    };
    return (
      <ButtonContainer onPress={() => setIsDatePickerOpen(true)}>
        <FutureBookingButton />
        <DatePicker
          open={isDatePickerOpen}
          date={moment(ride?.scheduledTo).add(ride?.scheduledTo ? 0 : 1, 'hours').toDate()}
          maximumDate={getFutureRideMaxDate()}
          minimumDate={getFutureRideMinDate()}
          mode="datetime"
          title={i18n.t('bottomSheetContent.ride.chosePickupTime')}
          onCancel={close}
          onConfirm={(date) => {
            setUnconfirmedPickupTime(date.getTime());
            changeBsPage(BS_PAGES.CONFIRM_PICKUP_TIME);
            close();
          }}
          modal
        />
      </ButtonContainer>
    );
  };

  const renderRideNotes = () => {
    const rideHasNotes = ride?.notes;
    return (
      <ButtonContainer
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
     PaymentMethodInterface | undefined = ridePaymentMethod === cashPaymentMethod.id
       ? cashPaymentMethod
       : paymentMethods.find(pm => pm.id === ridePaymentMethod);

    return (
      <ButtonContainer
        onPress={() => {
          setPopupName('payment');
        }}
        style={{ width: displayPassenger ? HALF_WIDTH : '100%' }}
      >
        <PaymentButton
          brand={selectedPaymentMethod?.brand}
          icon={creditCardIcon}
          title={selectedPaymentMethod?.name === cashPaymentMethod.name ? 'Cash' : (selectedPaymentMethod?.name || i18n.t('bottomSheetContent.ride.addPayment'))}
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
        data-test-id="selectService"
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
