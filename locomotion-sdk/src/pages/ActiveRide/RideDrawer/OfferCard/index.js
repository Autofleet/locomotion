import React, {Fragment} from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import i18n from '../../../../I18n';
import OfferRow from './OfferRow'
import NumberOfPassengerOffer from './NumberOfPassengerOffer';
import OfferButton from './OfferButton';
import xIcon from '../../../../assets/x.png';
import Button from '../../../../Components/Button';

const address = `
min-height: 50;
padding-top: 10;
padding-bottom: 10;
padding-start: 24;
align-items: center;
flex-direction: row;
`;

export const StopPointsEtaContainer = styled.View`
  ${address}
  padding-top: 0px;
  flex-direction: row;
  padding-start: 0;
  padding-end: 0;
  justify-content: space-between;
`;

export const CloseContainer = styled(Button)`
    position: absolute;
    right: 10px;
    top: 10px;
    width: 13px;
    height: 13px;
    z-index: 999;
`;


export const ResetInputIcon = styled.Image.attrs({ source: xIcon })`
    display: flex;
    height: 12px;
    width: 12px;
`;


export default ({
  origin, destination, rideState, requestStopPoints,pickupEtaDrift, dropoffEtaDrift, rideOffer,etaMediumThreshold, etaHighThreshold,
  offerExpired, onVerified, setLoading,onRenewOffer,cancelOffer,loading

}) => {
  return (
      <Fragment>

          {!loading
          ? (
            <CloseContainer onPress={cancelOffer} data-test-id='CancelOfferButton'>
              <ResetInputIcon />
            </CloseContainer>
          ) : null}

        <OfferRow
          pickup
          description={rideState ? origin && origin.description
            : requestStopPoints && requestStopPoints.pickup && requestStopPoints.pickup.description}
          eta={rideOffer.pickupTime}
          completedAt={rideState ? origin && origin.completedAt : undefined}
          rideOffer={rideOffer}
          etaDrift={pickupEtaDrift}
          etaMediumThreshold={etaMediumThreshold}
          etaHighThreshold={etaHighThreshold}
        />
        <OfferRow
          useBorder
          description={rideState ? destination && destination.description
            : requestStopPoints && requestStopPoints.dropoff && requestStopPoints.dropoff.description}
          eta={rideOffer.dropoffTime}
          completedAt={rideState ? destination && destination.completedAt
            : undefined}
          rideOffer={rideOffer}
          etaDrift={dropoffEtaDrift}
        />
        <NumberOfPassengerOffer amount={rideOffer.numberOfPassengers} scheduledTo={requestStopPoints.scheduledTo} />
        <OfferButton
          offerExpired={offerExpired}
          onVerified={onVerified}
          setLoading={setLoading}
          onRenewOffer={onRenewOffer}
          futureRide={requestStopPoints.scheduledTo !== null}
        />
        </Fragment>
  );
};

