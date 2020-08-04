import React, {Fragment} from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import I18n from '../../../../I18n';

const address = `
min-height: 50;
padding-top: 10;
padding-bottom: 10;
padding-start: 24;
align-items: center;
flex-direction: row;
`;

const styleForDriverIsArrivedState = `
  color: #08902d;
`;

export const RideStatusText = styled.Text`
  font-size: 14px;
  color: #666666;
  margin-start: 12;
  font-weight: 600;
  ${({ state }) => (state === 'driverArrived' ? styleForDriverIsArrivedState : null)}
`;

export const RideStatusContainer = styled.View`
  ${address}
  padding-bottom: 10px;
  flex-direction: column;
  padding-start: 10;
  padding-end: 20;

`;

export default ({
    rideState,pickupEta, dropoffEta, arrivingReminderMin, arrivingPush
}) => {

    const getTitle = () => {
        if(rideState === 'driverOnTheWay') {
            if((pickupEta <= arrivingReminderMin && pickupEta > 0) || (arrivingPush !== null && pickupEta > 0)) {
                return `${rideState}Eta`
            }

            if(pickupEta > arrivingReminderMin) {
                return `${rideState}`
            }

            if(pickupEta <= 0) {
                return `${rideState}Soon`
            }
        }

        if(rideState === 'onBoard') {
            if(dropoffEta > 0) {
                return `${rideState}`
            } else {
                return `${rideState}Soon`
            }
        }

        if(rideState === 'driverArrived') {
            return `${rideState}`
        }

    }

  return (
      <Fragment>
       {rideState
                ? (
                  <RideStatusContainer>
                    <RideStatusText state={rideState}>
                      {I18n.t(`home.rideStates.${getTitle()}`, { pickupEta, dropoffEta })}
                    </RideStatusText>
                  </RideStatusContainer>
                )
                : null}
        </Fragment>
  );
};
