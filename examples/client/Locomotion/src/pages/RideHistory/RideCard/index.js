import React, { createRef } from 'react';
import moment from 'moment';
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
  RideViewContainer,
  RideViewSecTextContainer,
  MainRideViewSectionContainer,
  RideViewSectionTitleText,
} from './styled';
import StopPointsVerticalView from '../StopPointsVerticalView';
import Map from './Map';
import i18n from '../../../I18n';
import { MMMM_DD_YYYY } from '../consts';
import DriverCard from '../../../Components/DriverCard';

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
        <DriverCard
          activeRide={false}
          ride={ride}
        />
      )}
    </RideViewContainer>
  );
};

export default RideView;
