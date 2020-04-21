import React, { Fragment } from 'react';
import { View } from 'react-native';

import moment from 'moment';
import i18n from '../../../../I18n';
import RoundedButton from '../../../../Components/RoundedButton';

import {
  FutureRidesButton,
  FutureRideButtonText,
  Container,
  DateTitle,
  SpsContainer,
  CancelContainer,
  CancelButtonContainer,
  DetailsRowContainer,
  CloseIcon,
  CloseIconContainer
} from './styled';
import StopPointRow from './StopPointRow';

export const FutureOrdersButton = ({
  futureRides, isOpen, onPress,
}) => {
  const onClosePress = () => {
    if(!futureRides || !futureRides.length) {
      return null;
    }

    return onPress();
  }

  return (
    futureRides && futureRides.length ? (
    <FutureRidesButton onPress={onClosePress}>
      <FutureRideButtonText>
        {isOpen
          ? i18n.t('home.futureRides.closeButton')
          : i18n.t('home.futureRides.openBookingsButton', { openBookings: futureRides ? futureRides.length : 0 })
        }
      </FutureRideButtonText>
      {isOpen ? (<CloseIconContainer><CloseIcon /></CloseIconContainer>): null}
    </FutureRidesButton>) : null
  );
}

export default ({
  futureRides, isOpen, onCancel, onPress
}) => {

  if (!futureRides || !isOpen) {
    return null;
  }


  return (
    <Fragment>
      {futureRides.map((ride) => {
        const { stop_points: stopPoints } = ride;

        return (
          <Container>
            <DateTitle>{moment(ride.scheduled_to).format('DD-MM-YYYY HH:mm')}</DateTitle>
            <DetailsRowContainer>
              <SpsContainer>
                <StopPointRow
                  pickup
                  description={stopPoints[0].description}
                />
                <StopPointRow
                  description={stopPoints[1].description}
                />
              </SpsContainer>
              <CancelContainer>
                <RoundedButton
                  hollow
                  height="30px"
                  width="70px"
                  onPress={() => onCancel(ride.external_id)}
                >
                  {i18n.t('home.futureRides.cancelButton')}
                </RoundedButton>
              </CancelContainer>
            </DetailsRowContainer>
          </Container>
        );
      })}
    </Fragment>
  );
};
