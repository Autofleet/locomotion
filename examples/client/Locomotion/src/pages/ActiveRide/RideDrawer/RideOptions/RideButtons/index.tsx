import React, { useContext } from 'react';
import FutureBookingButton from './FutureBookingButton';
import { Container, RowContainer, ButtonContainer, TouchableOpacityContainer } from './styled';
import { RidePageContext } from '../../../../../context/newRideContext';
import NoteButton from './NoteButton';
import i18n from '../../../../../I18n';
import plus from '../../../../../assets/bottomSheet/plus.svg'
import editNote from '../../../../../assets/bottomSheet/edit_note.svg'
import creditCardIcon from '../../../../../assets/bottomSheet/credit_card_icon.svg';
import PaymentButton from './PaymentButton';
import PaymentsContext from '../../../../../context/payments';
import { PaymentMethodInterface } from 'context/payments/interface';

interface RideButtonsProps {
    displayPassenger: boolean;
    setPopupName: Function;
}

const RideButtons = ({
    displayPassenger,
    setPopupName,
}: RideButtonsProps) => {
    const {
        ride,
    } = useContext(RidePageContext);
    
    const {
        paymentMethods
    }: {
        paymentMethods: PaymentMethodInterface[]
    } = PaymentsContext.useContainer();

    const renderFutureBooking = () => 
    <ButtonContainer>
        <FutureBookingButton />
    </ButtonContainer>;

    const renderRideNotes = () => {
        const rideHasNotes = ride.notes;
        return (
            <ButtonContainer>
                <TouchableOpacityContainer onPress={() => {
                    setPopupName('notes')
                }}>
                    <NoteButton 
                    icon={rideHasNotes ? editNote : plus}
                    title={i18n.t(rideHasNotes ? 
                        'bottomSheetContent.ride.notes.edit' : 
                        'bottomSheetContent.ride.notes.add' )}
                    />
                </TouchableOpacityContainer>
            </ButtonContainer>
        )
    };

    const renderPaymentButton = () => {
        const ridePaymentMethod = ride.paymentMethodId;
        const selectedPaymentMethod: PaymentMethodInterface | undefined =
             paymentMethods.find((pm) => pm.id === ridePaymentMethod);
        return (
        <ButtonContainer>
            <TouchableOpacityContainer onPress={() => {
                setPopupName('payment')
            }}>
            <PaymentButton
                brand={selectedPaymentMethod?.brand}
                icon={creditCardIcon}
                title={selectedPaymentMethod?.name || i18n.t('bottomSheetContent.ride.addPayment')} />
            </TouchableOpacityContainer>
        </ButtonContainer>
        )
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
        </Container>
    );
};

export default RideButtons;
