import React, {
  createRef, useEffect, useContext, useState,
} from 'react';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import GenericPopup from '../../../popups/GenericPopup';
import GenericErrorPopup from '../../../popups/GenericError';
import { isCardPaymentMethod } from '../../../lib/ride/utils';
import { getPriceCalculation } from '../../../context/futureRides/api';
import RidePaymentDetails from '../../../Components/RidePaymentDetails';
import PaymentContext from '../../../context/payments';
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
  RideViewContainer,
  RideViewSecTextContainer,
  MainRideViewSectionContainer,
  DetailsContainer,
  DriverCardContainer,
  StopPointsVerticalViewContainer,
  RideStateText,
  RetryPaymentButtonContainer,
} from './styled';
import StopPointsVerticalView from '../../../Components/StopPointsVerticalView';
import Map from './Map';
import i18n from '../../../I18n';
import { MMMM_DD_YYYY } from '../consts';
import DriverCard from '../../../Components/DriverCard';
import { getFormattedPrice } from '../../../context/newRideContext/utils';
import { PAYMENT_STATES, RIDE_STATES } from '../../../lib/commonTypes';
import TextButton from '../../../Components/TextButton';
import * as NavigationService from '../../../services/navigation';
import { MAIN_ROUTES } from '../../routes';
import ServiceTypeDetails from '../../../Components/ServiceTypeDetails';
import RoundedButton from '../../../Components/RoundedButton';
import contactUsIcon from '../../../assets/headset.svg';
import sucessIcon from '../../../assets/checkmark.svg';

const RideTitleCard = ({
  ride, page, showTip, tip, isPaymentRejected,
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
        <DayTitleSubText testID="rideTip">
          {priceText}
        </DayTitleSubText>
      );
    }
    const isLessThenFiveDaysSince = moment(moment()).diff(ride.scheduledTo || ride.createdAt, 'days') < 5;
    const isCard = ride.payment && ride.payment.paymentMethod && isCardPaymentMethod(ride.payment.paymentMethod);

    if (ride.state === RIDE_STATES.COMPLETED
      && isLessThenFiveDaysSince && isCard) {
      return <TextButton testID="AddATip" onPress={() => { NavigationService.navigate(MAIN_ROUTES.POST_RIDE, { rideId: ride.id, priceCalculationId: ride.priceCalculationId, fromHistory: true }); }} text={i18n.t('rideHistory.rideCard.addTip')} />;
    }
    return null;
  };

  const getPriceSubtitle = () => {
    if (isPaymentRejected) {
      return (
        <DaySecTitleSubText markError>
          {i18n.t('rideHistory.unpaidRide')}
        </DaySecTitleSubText>
      );
    } if (showTip) {
      return getTipButton();
    }
    return (
      <DaySecTitleSubText>
        {(ride.plannedDistance / 1000).toFixed(1)}
        {' '}
        KM
      </DaySecTitleSubText>
    );
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
              {`${moment(ride.lastMatchAttempt).format('h:mm A')
              } · ${ride.appDuration}`}
            </DayTitleSubText>
          ) : <RideStateText>{i18n.t(`rideHistory.ride.states.${ride.state}`)}</RideStateText>}
        </RideViewTextContainer>
        <RideViewSecTextContainer>
          <DaySecTitleText markError={isPaymentRejected} testID="ridePrice">
            {getFormattedPrice(ride.priceCurrency, ride.priceAmount)}
          </DaySecTitleText>
          {getPriceSubtitle()}
        </RideViewSecTextContainer>
      </TitleContainer>
    </>
  );
};

export const RideListView = ({
  ride, showSpacer, onPress, testID,
}) => (
  <>
    <TouchableRideViewContainer testID={testID} onPress={onPress}>
      <RideTitleCard
        ride={ride}
        isPaymentRejected={ride.payment?.state === PAYMENT_STATES.REJECTED}
      />
      <RideDrillDownContainer>
        <RideDrillDownIcon />
      </RideDrillDownContainer>
    </TouchableRideViewContainer>
    {showSpacer && <RideViewSpacer />}
  </>
);

const RideView = ({ ride }) => {
  const isRidePaymentRejected = ride.payment?.state === PAYMENT_STATES.REJECTED;
  const [tip, setTip] = useState(null);
  const [isPaymentSettled, setPaymentSettled] = useState(false);
  const [isUnableToProcessPopupVisible, setIsUnablToProcessPopupVisible] = useState(false);
  const [isPaymentSuccessPopupVisible, setIsPaymentSuccessPopupVisible] = useState(false);
  const isPaymentRejected = !isPaymentSettled && isRidePaymentRejected;

  const usePayments = PaymentContext.useContainer();

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

  const retryPayment = async () => {
    const paymentId = ride.payment?.id;
    const success = await usePayments.retryPayment(paymentId).catch((err) => {
      setIsUnablToProcessPopupVisible(true);
    });
    if (success) {
      setIsPaymentSuccessPopupVisible(true);
      setPaymentSettled(true);
      await usePayments.loadCustomer();
    } else {
      setIsUnablToProcessPopupVisible(true);
    }
  };

  const contactUsButton = (
    <RoundedButton
      icon={contactUsIcon}
      hollow
      style={{ justifyContent: 'center', border: '2px solid #24aaf2' }}
      onPress={() => {
        setIsUnablToProcessPopupVisible(false);
        NavigationService.navigate(MAIN_ROUTES.CONTACT_US);
      }}
    >
      {i18n.t('rideHistory.rideCard.paymentRetry.retryFailedButton')}
    </RoundedButton>
  );

  return (
    <>
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
            <RideTitleCard page ride={ride} showTip tip={tip} isPaymentRejected={isPaymentRejected} />
            <BlankContainer />
          </MainRideViewSectionContainer>
          {isPaymentRejected
            ? (
              <RetryPaymentButtonContainer>
                <RoundedButton style={{ backgroundColor: '#24aaf2' }} onPress={retryPayment}>
                  {i18n.t('rideHistory.rideCard.paymentRetry.retryPaymentButton')}
                </RoundedButton>
              </RetryPaymentButtonContainer>
            ) : null
        }
          <StopPointsVerticalViewContainer>
            <StopPointsVerticalView
              ride={ride}
            />
          </StopPointsVerticalViewContainer>
          <StopPointsVerticalViewContainer>
            <RidePaymentDetails
              rideId={ride.id}
              paymentMethod={ride?.payment?.paymentMethod}
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
      <GenericErrorPopup
        title={i18n.t('rideHistory.rideCard.paymentRetry.retryFailedTitle')}
        text={i18n.t('rideHistory.rideCard.paymentRetry.retryFailedBody')}
        isVisible={isUnableToProcessPopupVisible}
        customButton={contactUsButton}
        cancelPopup={() => setIsUnablToProcessPopupVisible(false)}
      />
      <GenericPopup
        title={i18n.t('rideHistory.rideCard.paymentRetry.retrySuccessTitle')}
        text={i18n.t('rideHistory.rideCard.paymentRetry.retrySuccessBody')}
        isVisible={isPaymentSuccessPopupVisible}
        closePopup={() => { setIsPaymentSuccessPopupVisible(false); }}
        icon={sucessIcon}
        buttonText={i18n.t('rideHistory.rideCard.paymentRetry.retrySuccessButton')}
      />
    </>
  );
};

export default RideView;
