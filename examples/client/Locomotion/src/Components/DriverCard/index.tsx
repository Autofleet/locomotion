import React from 'react';
import moment from 'moment';
import TextButton from '../TextButton';
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
  NotRated,
} from './styled';
import * as NavigationService from '../../services/navigation';
import { MAIN_ROUTES } from '../../pages/routes';

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
    const isMoreThenFiveDaysSince = moment(moment()).diff(ride.scheduledTo || ride.createdAt, 'days') > 5;
    if (isMoreThenFiveDaysSince) {
      const notRatedText = i18n.t('postRide.notRated');
      return (
        <NotRated>
          {notRatedText}
        </NotRated>
      );
    }
    return (
      <TextButton onPress={() => { NavigationService.navigate(MAIN_ROUTES.POST_RIDE, { rideId: ride.id, priceCalculationId: ride.priceCalculationId }); }} text={i18n.t('rideHistory.rideCard.rateRide')} />
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
