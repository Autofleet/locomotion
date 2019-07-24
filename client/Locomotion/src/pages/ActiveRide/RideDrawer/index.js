import React from 'react';
import {
  View,
  Image,
} from 'react-native';

import I18n from '../../../I18n';
import {
  Drawer, RideCard, RideStatusText, RideDetailsText, RideButton, RideButtonText,
  RideDetailsContainer, DriverAvatar,
} from './styled';
import StopPointRow from './StopPointRow';

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
  activeRide, openLocationSelect, requestStopPoints,
  cancelRide, createRide, readyToBook,
}) => {
  const [origin, destination] = activeRide ? activeRide.stop_points || [] : [];
  const rideState = getRideState(activeRide);
  const onCreateRide = () => (readyToBook ? createRide() : null);
  return (
    <Drawer>
      {rideState ? (
        <RideCard>
          <RideStatusText state={rideState}>
            {` ${I18n.t(`home.rideStates.${rideState}`)} `}
          </RideStatusText>
          <RideDetailsContainer>
            <View style={{ flex: 1 }}>
              <DriverAvatar source={{ uri: activeRide.driver.avatar }} />
              <RideDetailsText> Driver: </RideDetailsText>
              <RideDetailsText>
                {` ${activeRide.driver.first_name} ${activeRide.driver.last_name} `}
              </RideDetailsText>
            </View>
            <View style={{ flex: 1, textAlign: 'right' }}>
              <Image
                style={{
                  width: 80, height: 30, marginBottom: 10, alignSelf: 'flex-end',
                }}
                source={{ uri: activeRide.vehicle.image }}
              />
              <RideDetailsText right>
                {` ${activeRide.vehicle.model} (${activeRide.vehicle.color}) `}
              </RideDetailsText>
              <RideDetailsText right>{activeRide.vehicle.license_number}</RideDetailsText>
            </View>
          </RideDetailsContainer>
        </RideCard>
      ) : null}
      <StopPointRow
        pickup
        openLocationSelect={openLocationSelect}
        description={rideState ? origin && origin.description
          : requestStopPoints && requestStopPoints.pickup && requestStopPoints.pickup.description}
        eta={rideState ? origin && origin.eta : undefined}
        completedAt={rideState ? origin && origin.completed_at
          : undefined}
      />
      <StopPointRow
        openLocationSelect={openLocationSelect}
        description={rideState ? destination && destination.description
          : requestStopPoints && requestStopPoints.dropoff && requestStopPoints.dropoff.description}
        eta={rideState ? destination && destination.eta : undefined}
        completedAt={rideState ? destination && destination.completed_at
          : undefined}
      />
      {rideState === 'onBoard' ? null
        : (
          <RideButton
            onPress={rideState ? cancelRide : onCreateRide}
            inRide={rideState}
            readyToBook={!!readyToBook}
          >
            <RideButtonText>
              {` ${I18n.t(rideState ? 'home.cancelRideButton' : 'home.letsRideButton')} `}
            </RideButtonText>
          </RideButton>
        )
      }
    </Drawer>
  );
};

export default RideDrawer;
