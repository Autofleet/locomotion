/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import moment from 'moment';

import I18n from '../../../I18n';
import {
  Drawer,
  RideButtonContainer,
  DrawerContainer,
  DrawerButtonContainer,
  AddPaymentBar,
} from './styled';

import RoundedButton from '../../../Components/RoundedButton';
import RideCard from './RideCard';
import MessageCard from './MessageCard';
import { getTogglePopupsState } from '../../../context/state';
import PaymentsContext from '../../../context/payments';

import settingsContext from '../../../context/settings';

import StopPointsEtaCard from './StopPointsEtaCard';
import StopPointsCard from './StopPointsCard';
import OfferCard from './OfferCard';
import RideStatusHeader from './RideStatusHeader';
import FutureRides, { FutureOrdersButton } from './FutureRides';

const getRideState = (activeRide) => { // false, driverOnTheWay, driverArrived, onBoard
  if (!activeRide) {
    return false;
  }
  if (activeRide.stopPoints[0].completedAt) {
    return 'onBoard';
  }
  if (activeRide.stopPoints[0].arrivedAt) {
    return 'driverArrived';
  }
  return 'driverOnTheWay';
};

const RideDrawer = ({
  activeRide, openLocationSelect, requestStopPoints, setRideType,
  cancelRide, createRide, readyToBook, rideType, preRideDetails,
  onNumberOfPassengerChange, numberOfPassenger, createOffer, rideOffer,
  cancelOffer, offerExpired, onLocationSelect, closeAddressViewer, onRideSchedule,
  futureRides, cancelFutureRide, createFutureOffer, navigation,
}) => {
  const [origin, destination] = activeRide ? activeRide.stopPoints || [] : [];
  const [isPopupOpen, togglePopup] = getTogglePopupsState();
  const [appSettings, setAppSettings] = useState({});
  const [pickupEta, setPickupEta] = useState(null);
  const [dropoffEta, setDropoffpEta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [futureOrdersState, setFutureOrdersState] = useState(false);
  const [disableFutureBooking, setDisableFutureBooking] = useState(false);
  const [allowRideOrder, setAllowRideOrder] = useState(true);
  const usePayments = PaymentsContext.useContainer();

  const rideState = getRideState(activeRide);

  const buttonAction = async () => {
    closeAddressViewer();
    if (rideState) {
      return cancelRide();
    }

    if (((!rideOffer && readyToBook) || (rideOffer && offerExpired)) && !requestStopPoints.scheduledTo) {
      return createOffer();
    }

    if (!rideOffer && requestStopPoints.scheduledTo) {
      return createFutureOffer();
    }

    if (rideOffer) {
      return createRide();
    }
  };

  const useSettings = settingsContext.useContainer();

  const getPaymentMethodStatus = async () => {
    await usePayments.getPaymentMethods();
  };
  useEffect(() => {
    useSettings.getSettings();
    getPaymentMethodStatus();
  }, []);

  useEffect(() => {
    if (origin && origin.eta) {
      const etaDiff = moment(origin.eta).diff(moment(), 'minutes');
      setPickupEta(etaDiff);
    }

    if (destination && destination.eta) {
      const etaDiff = moment(destination.eta).diff(moment(), 'minutes');
      setDropoffpEta(etaDiff);
    }
  }, [origin, destination]);

  useEffect(() => {
    const maxFutureRides = useSettings.settingsList.MAX_FUTURE_RIDES;
    if (futureRides && futureRides.length >= maxFutureRides) {
      setDisableFutureBooking(true);
    } else {
      setDisableFutureBooking(false);
    }

    if (futureRides && futureRides.length === 0 && futureOrdersState) {
      setFutureOrdersState(false);
    }
  }, [futureRides]);

  useEffect(() => {
    if (usePayments.paymentMethods && usePayments.paymentMethods.length > 0) {
      setAllowRideOrder(true);
    } else {
      setAllowRideOrder(false);
    }
  }, [usePayments.paymentMethods]);
  return (
    <DrawerContainer>
      <FutureOrdersButton
        futureRides={futureRides}
        onPress={() => setFutureOrdersState(!futureOrdersState)}
        isOpen={futureOrdersState}
      />
      {!allowRideOrder
        ? <AddPaymentBar onPress={() => navigation.navigate('Payment')}>{I18n.t('payments.setPaymentBanner')}</AddPaymentBar> : null}
      <FutureRides
        futureRides={futureRides}
        isOpen={futureOrdersState}
        onCancel={cancelFutureRide}
        onPress={() => setFutureOrdersState(!futureOrdersState)}
      />
      <Drawer>
        <MessageCard
          title={I18n.t('popups.rideCancel.main')}
          subTitle={I18n.t('popups.rideCancel.sub')}
          id="rideCancel"
        />

        <MessageCard
          id="rideRejected"
          title={I18n.t('popups.rideRejected.main')}
          subTitle={I18n.t('popups.rideRejected.sub')}
        />

        {!isPopupOpen('ridePopupsStatus') && !futureOrdersState
          ? (
            <>
              <RideStatusHeader
                rideState={rideState}
                pickupEta={pickupEta}
                dropoffEta={dropoffEta}
                arrivingReminderMin={useSettings.settingsList.ARRIVE_REMINDER_MIN}
                arrivingPush={activeRide ? activeRide.arrivingPush : null}
              />

              {rideState && (pickupEta <= useSettings.settingsList.ARRIVE_REMINDER_MIN || (activeRide && activeRide.arrivingPush !== null) || rideState !== 'driverOnTheWay')
                ? (
                  <>
                    <RideCard activeRide={activeRide} rideState={rideState} />
                    {rideState !== 'onBoard' && rideState !== 'driverArrived'
                      ? (
                        <DrawerButtonContainer>
                          <RoundedButton
                            data-test-id="CancelRidePriceButton"
                            onPress={buttonAction}
                            hollow
                          >
                            {I18n.t('home.cancelRidePriceButton')}
                          </RoundedButton>
                        </DrawerButtonContainer>
                      ) : null}
                  </>
                )
                : rideState
                  ? (
                    <>
                      <StopPointsEtaCard
                        origin={origin}
                        destination={destination}
                        rideState={rideState}
                        requestStopPoints={requestStopPoints}
                        pickupEtaDrift={useSettings.settingsList.DISPLAY_ETA_DRIFT}
                        dropoffEtaDrift={useSettings.settingsList.DISPLAY_MAX_ETA_DRIFT}
                      />
                      <DrawerButtonContainer>
                        <RoundedButton
                          data-test-id="CancelRideButton"
                          onPress={buttonAction}
                          hollow
                        >
                          {I18n.t('home.cancelRideButton')}
                        </RoundedButton>
                      </DrawerButtonContainer>
                    </>
                  )
                  : null
              }

              {!rideState && !rideOffer ? (
                <>
                  <StopPointsCard
                    origin={origin}
                    destination={destination}
                    rideState={rideState}
                    requestStopPoints={requestStopPoints}
                    onNumberOfPassengerChange={onNumberOfPassengerChange}
                    numberOfPassenger={numberOfPassenger}
                    openLocationSelect={openLocationSelect}
                    readyToBook={readyToBook}
                    onLocationSelect={onLocationSelect}
                    closeAddressViewer={closeAddressViewer}
                    loading={loading}
                    onRideSchedule={onRideSchedule}
                    disableFutureBooking={disableFutureBooking}
                  />
                  {/* <Switch onChange={(active) => setRideType(active ? 'pool' : 'private')} active={rideType === 'pool'} /> */}
                  {/* preRideDetails.eta || preRideDetails.estimatePrice ? ( <PreRideBox {...preRideDetails} /> ) : null */}
                </>
              ) : null }

              {!rideState && rideOffer ? (
                <>
                  <OfferCard
                    origin={origin}
                    destination={destination}
                    rideState={rideState}
                    requestStopPoints={requestStopPoints}
                    pickupEtaDrift={useSettings.settingsList.DISPLAY_ETA_DRIFT}
                    dropoffEtaDrift={useSettings.settingsList.DISPLAY_MAX_ETA_DRIFT}
                    rideOffer={rideOffer}
                    etaMediumThreshold={useSettings.settingsList.ETA_MEDIUM_THRESHOLD}
                    etaHighThreshold={useSettings.settingsList.ETA_HIGH_THRESHOLD}
                    offerExpired={offerExpired}
                    onVerified={buttonAction}
                    onRenewOffer={buttonAction}
                    cancelOffer={cancelOffer}
                    setLoading={setLoading}
                    loading={loading}
                  />
                </>
              ) : null }
            </>
          ) : null}
      </Drawer>

      {!rideState && !isPopupOpen('ridePopupsStatus') && !rideOffer
        ? (
          <>
            <RideButtonContainer>
              {!futureOrdersState && (
              <RoundedButton
                data-test-id={rideState ? 'CancelRideButton' : 'LetsRideButton'}
                onPress={buttonAction}
                hollow={!readyToBook || !allowRideOrder}
                setLoading={setLoading}
                disabled={!readyToBook || !allowRideOrder}
              >
                {I18n.t(rideState ? 'home.cancelRideButton' : 'home.letsRideButton')}
              </RoundedButton>
              )}
            </RideButtonContainer>
          </>
        )
        : null
    }
    </DrawerContainer>
  );
};

export default RideDrawer;
console.disableYellowBox = true;
