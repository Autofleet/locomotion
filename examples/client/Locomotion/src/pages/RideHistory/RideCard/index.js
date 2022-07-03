import React, { createRef } from 'react';
import moment from 'moment';
import Stars, { StarIcon } from '../../../Components/Stars';
import {
  DaySecTitleSubText,
  DaySecTitleText,
  DayTitleSubText,
  DayTitleText,
  RideDrillDownIcon,
  RideViewSectionContainer,
  RideViewSpacer,
  RideViewTextContainer,
  TouchableRideViewContainer,
  RideDrillDownContainer,
  BlankContainer,
  MapRideViewContainer,
  RideViewTitleContainer,
  RatingBarContainer,
  RideViewContainer,
  RideViewSecTextContainer,
  MainRideViewSectionContainer,
  RideViewSectionTitleText,
  DriverRatingContainer,
  DriverAvatarContainer,
  DriverAvatar,
  DriverDetailContainer,
  DriverDetailText,
  DriverSectionContainer,
} from './styled';
import StopPointsVerticalView from '../StopPointsVerticalView';
import Map from './Map';
import i18n from '../../../I18n';
import { MMMM_DD_YYYY } from '../consts';

const RideTitleCard = ({ ride, page }) => (
  <>
    <RideViewTextContainer>
      <DayTitleText bigText={page}>
        {moment(ride.lastMatchAttempt).format(MMMM_DD_YYYY)}
      </DayTitleText>
      <DayTitleSubText noCap>
        {`${moment(ride.lastMatchAttempt).format('HH:mm')
        } · ${ride.appDuration}`}
      </DayTitleSubText>
    </RideViewTextContainer>
    <RideViewSecTextContainer>
      <DaySecTitleText>
        {ride.priceAmount || 0}
        {ride.priceCurrency === 'USD' ? '$' : ride.priceCurrency}
      </DaySecTitleText>
      <DaySecTitleSubText>
        {(ride.plannedDistance / 1000).toFixed(1)}
        {' '}
        KM
      </DaySecTitleSubText>
    </RideViewSecTextContainer>
  </>
);

export const RideListView = ({
  ride, showSpacer, onPress,
}) => (
  <>
    <TouchableRideViewContainer onPress={onPress}>
      <RideTitleCard
        ride={ride}
      />
      <RideDrillDownContainer>
        <RideDrillDownIcon />
      </RideDrillDownContainer>
    </TouchableRideViewContainer>
    {showSpacer && <RideViewSpacer />}
  </>
);

const formatDriverRating = rating => rating && rating.toFixed(1);
const MAX_NAME_LENGTH = 20;

const formatDriverName = name => name && name.substring(0, MAX_NAME_LENGTH);

const RideView = ({ ride }) => {
  const map = createRef();
  return (
    <RideViewContainer>
      <MapRideViewContainer>
        <Map
          ref={map}
          ride={ride}
        />
      </MapRideViewContainer>
      <MainRideViewSectionContainer>
        <RideTitleCard page ride={ride} />
        <BlankContainer />
      </MainRideViewSectionContainer>

      <RideViewSectionContainer>
        <RideViewTitleContainer>
          <RideViewSectionTitleText>
            {i18n.t('rideHistory.rideCard.rideJourney')}
          </RideViewSectionTitleText>
        </RideViewTitleContainer>
      </RideViewSectionContainer>
      <StopPointsVerticalView
        ride={ride}
      />
      {ride.driver && (
        <DriverSectionContainer>
          <RideViewTitleContainer>
            <RideViewSectionTitleText>
              {i18n.t('rideHistory.rideCard.driverRating')}
            </RideViewSectionTitleText>
          </RideViewTitleContainer>
          <DriverRatingContainer>
            <DriverAvatarContainer>
              <DriverAvatar source={{ uri: ride.driver.avatar }} />
            </DriverAvatarContainer>
            <DriverAvatarContainer>
              <DriverDetailContainer>
                <StarIcon isOn height="8px" width="8px" />
                <DriverDetailText>{formatDriverRating(ride.driver.rating)}</DriverDetailText>
              </DriverDetailContainer>
              <DriverDetailContainer>
                <DriverDetailText>
                  {formatDriverName(ride.driver.firstName || '')}
                  {formatDriverName(ride.driver.lastName || '')}
                </DriverDetailText>
              </DriverDetailContainer>
            </DriverAvatarContainer>
            <RatingBarContainer>
              <Stars rating={ride.rating || 0} />
            </RatingBarContainer>
          </DriverRatingContainer>
        </DriverSectionContainer>
      )}
    </RideViewContainer>
  );
};

export default RideView;
