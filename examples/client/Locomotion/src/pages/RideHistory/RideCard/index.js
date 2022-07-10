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
} from './styled';
import StopPointsVerticalView from '../../../Components/StopPointsVerticalView';
import Map from './Map';
import i18n from '../../../I18n';
import { MMMM_DD_YYYY } from '../consts';
import DriverCard from '../../../Components/DriverCard';
import { getCurrencySymbol } from '../../../context/newRideContext/utils';

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
        {`${getCurrencySymbol(ride.priceCurrency)}${ride.priceAmount}`}
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
      <StopPointsVerticalViewContainer>
        <StopPointsVerticalView
          ride={ride}
        />
      </StopPointsVerticalViewContainer>
      <StopPointsVerticalViewContainer>
        <RidePaymentDetails
          payment={ride.payment}
          priceAmount={ride.priceAmount}
          priceCurrency={ride.priceCurrency}
        />
      </StopPointsVerticalViewContainer>
      <DriverCardContainer>
        {ride.driver && (
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
