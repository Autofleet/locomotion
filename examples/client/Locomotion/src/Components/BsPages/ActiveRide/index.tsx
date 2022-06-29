import React, { useContext } from 'react';
import moment from 'moment';
import { RidePageContext } from '../../../context/newRideContext';
import DriverCard from '../../DriverCard';
import {
  TopContainer, VehicleDetails, VehicleImage, VehiclePlateText, VehiclePlateContainer,
  DriverCardContainer, StopPointTextContainer, StopPointText, StopPointsTimeContainer,
  StopPointTimeText, PulseContainer,
} from './styled';
import { STOP_POINT_STATES } from '../../../lib/commonTypes';
import i18n from '../../../I18n';
import pulse from '../../../assets/marker-pulse.json';
import Loader from '../../Loader';

const ActiveRideContent = () => {
  const { ride } = useContext(RidePageContext);

  const {
    vehicle,
  } = ride;

  const { stopPoints } = ride;

  const firstSpNotCompleted = stopPoints?.find(p => p.state !== STOP_POINT_STATES.COMPLETED);

  const getTextBasedOnStopPoints = () => {
    if (firstSpNotCompleted) {
      return i18n.t(`activeRide.${firstSpNotCompleted.type}.${firstSpNotCompleted.state}`);
    }
  };

  const getMinDifferent = () => {
    if (firstSpNotCompleted) {
      const min = moment(firstSpNotCompleted.plannedArrivalTime).diff(moment(), 'minutes');
      return min < 1 ? i18n.t('now') : i18n.t('min', { min });
    }
  };

  return (
    <>
      <TopContainer>
        <DriverCardContainer>
          <DriverCard
            activeRide
            ride={ride}
          />
        </DriverCardContainer>
        <VehicleDetails>
          <VehicleImage source={{ uri: vehicle.image }} />
          <VehiclePlateContainer>
            <VehiclePlateText>{vehicle.licensePlate}</VehiclePlateText>
          </VehiclePlateContainer>
        </VehicleDetails>
      </TopContainer>
      <StopPointTextContainer>
        <StopPointText>
          {getTextBasedOnStopPoints()}
        </StopPointText>
        <StopPointsTimeContainer>
          <PulseContainer>
            <Loader dark={false} sourceProp={pulse} lottieViewStyle={{ width: 24, height: 24 }} />
          </PulseContainer>
          <StopPointTimeText>{getMinDifferent()}</StopPointTimeText>
        </StopPointsTimeContainer>
      </StopPointTextContainer>
    </>
  );
};

export default ActiveRideContent;
