import React, { Fragment, useState } from 'react';
import {
  View,
  Image,
} from 'react-native';
import moment from 'moment';

import I18n from '../../../I18n';
import {
  Drawer, RideButton, PreRideBox,RideButtonContainer, StopPointsEtaContainer,RideStatusText,RideStatusContainer
} from './styled';
import StopPointRow from './StopPointRow';
import StopPointEta from './StopPointEta';
import RideType from './RideType';
import Switch from '../../../Components/Switch'
import NumberOfPassenger from './NumberOfPassenger';
import RoundedButton from '../../../Components/RoundedButton';
import RideCard from './RideCard';
import MessageCard from './MessageCard';

const getRideState = (activeRide) => { // false, driverOnTheWay, driverArrived, onBoard
  if (!activeRide) {
    return false;
  }
  if (activeRide.stop_points[0].completed_at) {
    return 'onBoard';
  }
  if (activeRide.stop_points[0].arrived_at) {
    return 'driverArrived';
  }
  return 'driverOnTheWay';
};

const RideDrawer = ({
  activeRide, openLocationSelect, requestStopPoints, setRideType,
  cancelRide, createRide, readyToBook, rideType, preRideDetails,
  onNumberOfPassengerChange, numberOfPassenger
}) => {
  const [origin, destination] = activeRide ? activeRide.stop_points || [] : [];
  const [canceledRide, setCanceledRide] = useState(null)
  const rideState = getRideState(activeRide);
  const onCreateRide = () => (readyToBook ? createRide() : null);
  console.log(activeRide);
  console.log(origin);
  if(origin) {

    console.log(moment(origin.eta).format('HH:mm'));
  }


  return (
    <Drawer>
      <MessageCard
        title={I18n.t('popups.rideCancel.main')}
        subTitle={I18n.t('popups.rideCancel.sub')}
        />
      {rideState ?
      <RideStatusContainer>
        <RideStatusText state={rideState}>
            {` ${I18n.t(`home.rideStates.${rideState}`)} `}
        </RideStatusText>
      </RideStatusContainer> : null}
      {rideState && (moment(origin.eta).add(7,'minutes')).isSameOrBefore(moment()) ?
      <RideCard activeRide={activeRide} rideState={rideState}></RideCard> :

      <StopPointsEtaContainer>
        <StopPointEta
          pickup
          useBorder
          openLocationSelect={openLocationSelect}
          description={rideState ? origin && origin.description
            : requestStopPoints && requestStopPoints.pickup && requestStopPoints.pickup.description}
            eta={rideState ? origin && origin.eta : undefined}
            completedAt={rideState ? origin && origin.completed_at
              : undefined}
          />
        <StopPointEta
          useBorder
          openLocationSelect={openLocationSelect}
          description={rideState ? destination && destination.description
            : requestStopPoints && requestStopPoints.dropoff && requestStopPoints.dropoff.description}
            eta={rideState ? destination && destination.eta : undefined}
            completedAt={rideState ? destination && destination.completed_at
              : undefined}
          />
        </StopPointsEtaContainer>}
      {!rideState ? (
        <Fragment>
          <NumberOfPassenger onChange={onNumberOfPassengerChange} amount={numberOfPassenger} />
          {/* <Switch onChange={(active) => setRideType(active ? 'pool' : 'private')} active={rideType === 'pool'} /> */}
          {preRideDetails.eta || preRideDetails.estimatePrice ? ( <PreRideBox {...preRideDetails} /> ) : null }
        </Fragment>
      ) : null }

      {rideState === 'onBoard' ? null
        : (
          <RideButtonContainer>
            <RideButton
              onPress={rideState ? cancelRide : onCreateRide}
              hollow>
              {` ${I18n.t(rideState ? 'home.cancelRideButton' : 'home.letsRideButton')} `}
            </RideButton>
          </RideButtonContainer>


        )
      }
    </Drawer>
  );
};

/* <RideButton

            inRide={rideState}
            readyToBook={!!readyToBook}
          >
            <RideButtonText>
              {` ${I18n.t(rideState ? 'home.cancelRideButton' : 'home.letsRideButton')} `
            </RideButtonText>
          </RideButton> */
export default RideDrawer;
console.disableYellowBox = true;