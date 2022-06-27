import React, { useContext } from 'react';
import FutureBookingButton from './FutureBookingButton';
import {
  Container, RowContainer, ButtonContainer, ButtonText, StyledButton,
} from './styled';
import { RidePageContext } from '../../../../../context/newRideContext';
import NoteButton from './NoteButton';
import i18n from '../../../../../I18n';
import plus from '../../../../../assets/bottomSheet/plus.svg';
import editNote from '../../../../../assets/bottomSheet/edit_note.svg';
import creditCardIcon from '../../../../../assets/bottomSheet/credit_card_icon.svg';
import PaymentButton from './PaymentButton';
import PaymentsContext from '../../../../../context/payments';
import { PaymentMethodInterface } from '../../../../../context/payments/interface';
import * as NavigationService from '../../../../../services/navigation';
import { MAIN_ROUTES } from '../../../../routes';
import { RideStateContextContext } from '../../../../../context/ridePageStateContext';
import { popupNames } from '../utils';


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
  } = useContext(RidePageContext);

  const {
    setCurrentBsPage,
  } = useContext(RideStateContextContext);

  const {
    paymentMethods,
  }: {
        paymentMethods: PaymentMethodInterface[],
    } = PaymentsContext.useContainer();

  const renderFutureBooking = () => (
    <ButtonContainer disabled>
      <FutureBookingButton />
    </ButtonContainer>
  );

  const renderRideNotes = () => {
    const rideHasNotes = ride.notes;
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
    const ridePaymentMethod = ride.paymentMethodId;
    const selectedPaymentMethod: PaymentMethodInterface | undefined = paymentMethods.find(pm => pm.id === ridePaymentMethod);
    return (
      <ButtonContainer
        onPress={() => {
          setPopupName('payment');
        }}
        style={{ width: displayPassenger ? '48%' : '100%' }}
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
          setCurrentBsPage('CONFIRM_PICKUP');
        }}
      >
        <ButtonText>{i18n.t('general.select').toString()}</ButtonText>
      </StyledButton>
    </Container>
  );
};

export default RideButtons;
