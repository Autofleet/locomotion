import React from 'react';
import CardsTitle from '../CardsTitle';
import { RideInterface } from '../../context/newRideContext';
import i18n from '../../I18n';
import Stars, { StarIcon } from '../Stars';
import {
  RatingBarContainer,
  DriverRatingContainer,
  DriverAvatarContainer,
  DriverAvatar,
  DriverDetailContainer,
  DriverDetailText,
  DriverSectionContainer,
  DriverRatingText,
  VehicleModelNameText,
  DriverDetailsContainer,
  TextButton,
  ButtonText,
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
}: DriverCardProps) => {
  const getRatingSection = () => {
    if (ride.rating) {
      return (
        <RatingBarContainer>
          <Stars rating={ride.rating || 0} />
        </RatingBarContainer>
      );
    }
    return (
      <TextButton noBackground onPress={() => {}}>
        <ButtonText>
          {i18n.t('rideHistory.rideCard.rateRide')}
        </ButtonText>
      </TextButton>
    );
  };
  return (
    <DriverSectionContainer>
      {!activeRide && (
      <CardsTitle title={i18n.t('rideHistory.rideCard.driverRating')} />
      )}
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
              {formatDriverName(ride.driver?.firstName || '')}
              {formatDriverName(ride.driver?.lastName || '')}
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
          getRatingSection()
        )}
      </DriverRatingContainer>
    </DriverSectionContainer>
  );
};

export default DriverCard;
