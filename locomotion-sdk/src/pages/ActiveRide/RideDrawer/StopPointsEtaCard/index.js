import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import i18n from '../../../../I18n';
import StopPointEtaRow from './StopPointEtaRow';

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

export default ({
  pickup, origin, destination, rideState,requestStopPoints, pickupEtaDrift, dropoffEtaDrift,
}) => {
  return (
    <StopPointsEtaContainer>
      <StopPointEtaRow
          pickup
          description={rideState ? origin && origin.description
          : requestStopPoints && requestStopPoints.pickup && requestStopPoints.pickup.description}
          eta={rideState ? origin && origin.metadata && origin.metadata.firstEta : undefined}
          completedAt={rideState ? origin && origin.completedAt
          : undefined}
          etaDrift={pickupEtaDrift}
      />
      <StopPointEtaRow
          description={rideState ? destination && destination.description
          : requestStopPoints && requestStopPoints.dropoff && requestStopPoints.dropoff.description}
          eta={rideState ? destination && destination.metadata && destination.metadata.firstEta : undefined}
          completedAt={rideState ? destination && destination.completedAt
          : undefined}
          etaDrift={dropoffEtaDrift}
      />
    </StopPointsEtaContainer>
  );
};
