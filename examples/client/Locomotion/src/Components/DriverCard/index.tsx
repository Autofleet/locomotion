import React from 'react';
import { RideInterface } from '../../context/newRideContext';
import i18n from '../../I18n';
import Stars, { StarIcon } from '../Stars';
import {
  RideViewTitleContainer,
  RatingBarContainer,
  RideViewSectionTitleText,
  DriverRatingContainer,
  DriverAvatarContainer,
  DriverAvatar,
  DriverDetailContainer,
  DriverDetailText,
  DriverSectionContainer,
  DriverRatingText,
  VehicleModelNameText,
  DriverDetailsContainer,
} from './styled';

interface DriverCardProps {
    activeRide: boolean;
    ride: RideInterface;
}

const formatDriverRating = (rating: number): string | 0 => rating && rating.toFixed(1);
const MAX_NAME_LENGTH = 20;

const formatDriverName = (name: string): string => name && name.substring(0, MAX_NAME_LENGTH);

const DriverCard = ({
  ride,
  activeRide,
}: DriverCardProps) => (
  <DriverSectionContainer>
    <RideViewTitleContainer>
      {!activeRide && (
      <RideViewSectionTitleText>
        {i18n.t('rideHistory.rideCard.driverRating').toString()}
      </RideViewSectionTitleText>
      )}
    </RideViewTitleContainer>
    <DriverRatingContainer>
      <DriverAvatarContainer>
        <DriverAvatar source={{ uri: ride?.driver?.avatar }} />
      </DriverAvatarContainer>
      <DriverDetailsContainer>
        <DriverDetailContainer>
          <StarIcon isOn height="8px" width="8px" />
          <DriverRatingText>{formatDriverRating(ride?.driver?.rating)}</DriverRatingText>
        </DriverDetailContainer>
        <DriverDetailContainer>
          <DriverDetailText numberOfLines={1} activeRide={activeRide}>
            AAAAAQA TEST - Pizza
          </DriverDetailText>
        </DriverDetailContainer>
        {activeRide && (
        <DriverDetailContainer>
          <VehicleModelNameText>
            {ride?.vehicle?.model?.name || ''}
          </VehicleModelNameText>
        </DriverDetailContainer>
        )}
      </DriverDetailsContainer>
      {!activeRide && (
      <RatingBarContainer>
        <Stars rating={ride.rating || 0} />
      </RatingBarContainer>
      )}
    </DriverRatingContainer>
  </DriverSectionContainer>
);

export default DriverCard;
