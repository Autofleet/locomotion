import React, { useContext, useState } from 'react';
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
    updateRide,
  } = useContext(RidePageContext);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const {
    changeBsPage,
  } = useContext(RideStateContextContext);

  const {
    paymentMethods,
  }: {
        paymentMethods: PaymentMethodInterface[],
    } = PaymentsContext.useContainer();

  const renderFutureBooking = () => {
    const maxDate = moment().add(7, 'days').toDate();
    const minDate = moment().add(5, 'minutes').toDate(); // setting - Dispatch Future Rides Immediately
    const close = () => {
      setIsDatePickerOpen(false);
    };
    return (
      <ButtonContainer onPress={() => setIsDatePickerOpen(true)}>
        <FutureBookingButton />
        <DatePicker
          open={isDatePickerOpen}
          date={new Date(ride?.afterTime || Date())}
          maximumDate={maxDate}
          minimumDate={minDate}
          mode="datetime"
          title={i18n.t('bottomSheetContent.ride.chosePickupTime')}
          onCancel={close}
          onConfirm={(date) => {
            updateRide({ afterTime: date.getTime() });
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
      <ButtonContainer onPress={() => {
        setPopupName('notes');
      }}
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
    const selectedPaymentMethod: PaymentMethodInterface | undefined = paymentMethods.find(pm => pm.id === ridePaymentMethod);
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
          title={selectedPaymentMethod?.name || i18n.t('bottomSheetContent.ride.addPayment')}
        />
      </ButtonContainer>
    );
  };

  return (
    <Container>
      <RowContainer>
        <>
          {renderFutureBooking()}
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
        disabled={!chosenService}
        onPress={() => {
          changeBsPage(BS_PAGES.CONFIRM_PICKUP);
        }}
      >
        <ButtonText>{i18n.t('general.select').toString()}</ButtonText>
      </StyledButton>
    </Container>
  );
};

export default RideButtons;
