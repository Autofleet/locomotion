import React, { useContext } from 'react';
import FutureBookingButton from './FutureBookingButton';
import { Container, RowContainer, ButtonContainer } from './styled';
import { RidePageContext } from '../../../../../context/newRideContext';
import NoteButton from './NoteButton';
import i18n from '../../../../../I18n';
import plus from '../../../../../assets/bottomSheet/plus.svg'
import editNote from '../../../../../assets/bottomSheet/edit_note.svg'
const RideButtons = ({
    displayPassenger,
}) => {
    const {
        ride,
        updateRide,
    } = useContext(RidePageContext);

    const renderRideNotes = () => {
        const rideHasNotes = ride.notes;
        return (
            <ButtonContainer>
                <NoteButton 
                icon={rideHasNotes ? editNote : plus}
                title={i18n.t(rideHasNotes ? 'bottomSheetContent.ride.notes.edit': 'bottomSheetContent.ride.notes.add' )}
                />
            </ButtonContainer>
        )
    }

    return (
        <Container>
            <RowContainer>
                <ButtonContainer>
                    <FutureBookingButton />
                </ButtonContainer>
                {displayPassenger ? <></> : renderRideNotes()}
            </RowContainer>
            <RowContainer>
            {displayPassenger && renderRideNotes()}
                <ButtonContainer>
                    <FutureBookingButton />
                </ButtonContainer>
            </RowContainer>
        </Container>
    );
};

export default RideButtons;
