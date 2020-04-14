import React, { Fragment, useEffect } from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';
import i18n from '../../../../I18n';
import StopPointRow from './StopPointRow';
import NumberOfPassenger from './NumberOfPassenger';
import AddressView from './AddressView';
import TimeSelector from './TimeSelector';

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

const Overlay = styled.View`
  opacity: 0.7;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: #ffffff;

`;

export default ({
  origin,
  destination,
  rideState,
  onNumberOfPassengerChange,
  numberOfPassenger,
  requestStopPoints,
  openLocationSelect,
  readyToBook,
  onLocationSelect,
  closeAddressViewer,
  loading,
}) => (
  !requestStopPoints.openEdit
    ? (
      <Fragment>
        <StopPointRow
          pickup
          useBorder
          openLocationSelect={() => openLocationSelect('pickup')}
          description={rideState ? origin && origin.description
            : requestStopPoints && requestStopPoints.pickup && requestStopPoints.pickup.description}
          completedAt={rideState ? origin && origin.completed_at
            : undefined}
          title={i18n.t('addressView.pickupTitle')}
          selected={requestStopPoints.selectedType === 'pickup'}
        />
        <StopPointRow
          useBorder
          openLocationSelect={() => openLocationSelect('dropoff')}
          description={rideState ? destination && destination.description
            : requestStopPoints && requestStopPoints.dropoff && requestStopPoints.dropoff.description}
          completedAt={rideState ? destination && destination.completed_at
            : undefined}
          title={i18n.t('addressView.dropoffTitle')}
          selected={requestStopPoints.selectedType === 'dropoff'}
        />
        {readyToBook
          ? (
            <Fragment>
              <NumberOfPassenger onChange={onNumberOfPassengerChange} amount={numberOfPassenger} />
              <TimeSelector />
            </Fragment>
          )
          : null}


        {loading ? <Overlay /> : null}
      </Fragment>
    )
    : (
      <AddressView
        onLocationSelect={onLocationSelect}
        requestStopPoints={requestStopPoints}
        type={requestStopPoints.selectedType}
        onClose={closeAddressViewer}
      />
    )
);
