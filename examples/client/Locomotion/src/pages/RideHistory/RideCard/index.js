import React, {
  createRef, useEffect, useContext, useState,
} from 'react';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import FullPageLoader from '../../../Components/FullPageLoader';
import { getPriceCalculation } from '../../../context/futureRides/api';
import RidePaymentDetails from '../../../Components/RidePaymentDetails';
import {
  DaySecTitleSubText,
  DaySecTitleText,
  DayTitleSubText,
  DayTitleText,
  RideDrillDownIcon,
  TitleContainer,
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
  DetailsContainer,
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
import { RidePageContext, PriceCalculation } from '../../../context/newRideContext';
import { RIDE_STATES } from '../../../lib/commonTypes';
import TextButton from '../../../Components/TextButton';
import * as NavigationService from '../../../services/navigation';
import { MAIN_ROUTES } from '../../routes';
import ServiceTypeDetails from '../../../Components/ServiceTypeDetails';

const RideTitleCard = ({
  ride, page, showTip, tip,
}) => {
  const isDebuggingEnabled = (typeof atob !== 'undefined');
  const getTipButton = () => {
    if (!isDebuggingEnabled && tip === null) {
      return (
        <SkeletonContent
          containerStyle={{}}
          isLoading
          layout={[
            { width: 40, height: 10, marginTop: 10 },
          ]}
        />
      );
    } if (tip) {
      const price = getFormattedPrice(ride.priceCurrency, tip);
      const priceText = i18n.t('rideHistory.rideCard.tip', { price });
      return (
        <DayTitleSubText>
          {priceText}
        </DayTitleSubText>
      );
    }
    const isLessThenFiveDaysSince = moment(moment()).diff(ride.scheduledTo || ride.createdAt, 'days') < 5;
    if (ride.state === RIDE_STATES.COMPLETED
      && isLessThenFiveDaysSince) {
      return <TextButton onPress={() => { NavigationService.navigate(MAIN_ROUTES.POST_RIDE, { rideId: ride.id, priceCalculationId: ride.priceCalculationId }); }} text={i18n.t('rideHistory.rideCard.addTip')} />;
    }
  };

  return (
    <>
      <TitleContainer>
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
          {showTip
            ? getTipButton()
            : (
              <DaySecTitleSubText>
                {(ride.plannedDistance / 1000).toFixed(1)}
                {' '}
                KM
              </DaySecTitleSubText>
            )
          }
        </RideViewSecTextContainer>
      </TitleContainer>
    </>
  );
};

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
  const [tip, setTip] = useState(null);
  const map = createRef();
  const getTip = async () => {
    const priceCalculation = await getPriceCalculation(ride.priceCalculationId);
    const tipObj = priceCalculation.additionalCharges.find(charge => charge.chargeFor === 'tip');
    setTip((tipObj || {}).amount);
  };

  useFocusEffect(() => {
    if (ride.priceCalculationId) {
      getTip();
    }
  });

  return (
    <RideViewContainer>
      <MapRideViewContainer>
        <Map
          disableMarkers={ride.state !== RIDE_STATES.COMPLETED}
          ref={map}
          ride={ride}
        />
      </MapRideViewContainer>
      <DetailsContainer>
        <MainRideViewSectionContainer>
          <RideTitleCard page ride={ride} showTip tip={tip} />
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
            paymentMethod={ride.payment?.paymentMethod}
            state={ride.state}
            currency={ride.priceCurrency}
            rideHistory
          />
        </StopPointsVerticalViewContainer>
        <DriverCardContainer>
          {ride.driver && ride.state === RIDE_STATES.COMPLETED && (
          <DriverCard
            noPaddingLeft
            activeRide={false}
            ride={ride}
          />
          )}
        </DriverCardContainer>
        <ServiceTypeDetails
          serviceType={ride.serviceType}
        />
      </DetailsContainer>
    </RideViewContainer>
  );
};

export default RideView;
