import React, { createRef } from 'react';
import moment from 'moment';
import RidePaymentDetails from '../../../Components/RidePaymentDetails';
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
  DriverCardContainer,
  StopPointsVerticalViewContainer,
  RideStateText,
} from './styled';
import StopPointsVerticalView from '../../../Components/StopPointsVerticalView';
import Map from './Map';
import i18n from '../../../I18n';
import { MMMM_DD_YYYY } from '../consts';
import DriverCard from '../../../Components/DriverCard';
import { getFormattedPrice } from '../../../context/newRideContext/utils';
import { RIDE_STATES } from '../../../lib/commonTypes';

const RideTitleCard = ({ ride, page }) => (
  <>
    <RideViewTextContainer>
      <DayTitleText bigText={page}>
        {moment(ride.scheduledTo || ride.createdAt).format(MMMM_DD_YYYY)}
      </DayTitleText>
      {ride.state === RIDE_STATES.COMPLETED ? (
        <DayTitleSubText noCap>
          {`${moment(ride.lastMatchAttempt).format('HH:mm')
          } · ${ride.appDuration}`}
        </DayTitleSubText>
      ) : <RideStateText>{i18n.t(`rideHistory.ride.states.${ride.state}`)}</RideStateText>}
    </RideViewTextContainer>
    <RideViewSecTextContainer>
      <DaySecTitleText>
        {getFormattedPrice(ride.priceCurrency, ride.priceAmount)}
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
          disableMarkers={ride.state !== RIDE_STATES.COMPLETED}
          ref={map}
          ride={ride}
        />
      </MapRideViewContainer>
      <MainRideViewSectionContainer>
        <RideTitleCard page ride={ride} />
        <BlankContainer />
      </MainRideViewSectionContainer>
      <StopPointsVerticalViewContainer>
        <StopPointsVerticalView
          ride={ride}
        />
      </StopPointsVerticalViewContainer>
      <StopPointsVerticalViewContainer>
        <RidePaymentDetails
          rideId={ride.id}
          paymentMethod={ride.payment.paymentMethod}
          rideHistory
        />
      </StopPointsVerticalViewContainer>
      <DriverCardContainer>
        {ride.driver && ride.state === RIDE_STATES.COMPLETED && (
        <DriverCard
          activeRide={false}
          ride={ride}
        />
        )}
      </DriverCardContainer>
    </RideViewContainer>
  );
};

export default RideView;
