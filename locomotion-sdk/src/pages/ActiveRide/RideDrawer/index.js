/* eslint-disable no-nested-ternary */
import React, {
  Fragment, useState, useEffect, useRef,
} from 'react';
import {
  View,
  Image,
  Text,
} from 'react-native';
import moment from 'moment';

import I18n from '../../../I18n';
import {
  Drawer,
  RideButtonContainer,
  DrawerContainer,
  DrawerButtonContainer,
  FutureOrder,
  FutureText,
} from './styled';
import RideType from './RideType';
import Switch from '../../../Components/Switch';

import RoundedButton from '../../../Components/RoundedButton';
import RideButton from '../../../Components/RideButton';
import RideCard from './RideCard';
import MessageCard from './MessageCard';
import { getTogglePopupsState } from '../../../context/main';
import network from '../../../services/network';
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
  futureRides, cancelFutureRide,createFutureOffer
}) => {
  const [origin, destination] = activeRide ? activeRide.stopPoints || [] : [];
  const [isPopupOpen, togglePopup] = getTogglePopupsState();
  const [appSettings, setAppSettings] = useState({});
  const [pickupEta, setPickupEta] = useState(null);
  const [dropoffEta, setDropoffpEta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [futureOrdersState, setFutureOrdersState] = useState(false);
  const [disableFutureBooking, setDisableFutureBooking] = useState(false);

  const rideState = getRideState(activeRide);

  const buttonAction = async () => {
    closeAddressViewer();
    if (rideState) {
      return cancelRide();
    }

    if (((!rideOffer && readyToBook) || (rideOffer && offerExpired)) && !requestStopPoints.scheduledTo) {
      return createOffer();
    }

    if(!rideOffer && requestStopPoints.scheduledTo) {
      return createFutureOffer()
    }

    if (rideOffer) {
      return createRide();
    }
  };

  const useSettings = settingsContext.useContainer();

  useEffect(() => {
    useSettings.getSettings();
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
    if(futureRides && futureRides.length >= maxFutureRides) {
      setDisableFutureBooking(true)
    } else {
      setDisableFutureBooking(false)
    }

    if(futureRides && futureRides.length === 0 && futureOrdersState) {
      setFutureOrdersState(false)
    }
  }, [futureRides])
  return (
    <DrawerContainer>
      <FutureOrdersButton
        futureRides={futureRides}
        onPress={() => setFutureOrdersState(!futureOrdersState)}
        isOpen={futureOrdersState}
      />
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
            <Fragment>
              <RideStatusHeader
                rideState={rideState}
                pickupEta={pickupEta}
                dropoffEta={dropoffEta}
                arrivingReminderMin={useSettings.settingsList.ARRIVE_REMINDER_MIN}
              />

              {rideState && (pickupEta <= useSettings.settingsList.ARRIVE_REMINDER_MIN || activeRide.arrivingPush !== false || rideState !== 'driverOnTheWay')
                ? (
                  <Fragment>
                    <RideCard activeRide={activeRide} rideState={rideState} />
                    {rideState !== 'onBoard' && rideState !== 'driverArrived'
                      ? (
                        <DrawerButtonContainer>
                          <RoundedButton
                            onPress={buttonAction}
                            hollow
                          >
                            {I18n.t('home.cancelRidePriceButton')}
                          </RoundedButton>
                        </DrawerButtonContainer>
                      ) : null}
                  </Fragment>
                )
                : rideState
                  ? (
                    <Fragment>
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
                          onPress={buttonAction}
                          hollow
                        >
                          {I18n.t('home.cancelRideButton')}
                        </RoundedButton>
                      </DrawerButtonContainer>
                    </Fragment>
                  )
                  : null
              }

              {!rideState && !rideOffer ? (
                <Fragment>
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
                </Fragment>
              ) : null }

              {!rideState && rideOffer ? (
                <Fragment>
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
                </Fragment>
              ) : null }
            </Fragment>
          ) : null}
      </Drawer>

      {!rideState && !isPopupOpen('ridePopupsStatus') && !rideOffer
        ? (
          <RideButtonContainer>
            <RideButton
              onPress={buttonAction}
              hollow={!readyToBook}
              setLoading={setLoading}
            >
              {I18n.t(rideState ? 'home.cancelRideButton' : 'home.letsRideButton')}
            </RideButton>
          </RideButtonContainer>
        )
        : null
    }
    </DrawerContainer>
  );
};

export default RideDrawer;
console.disableYellowBox = true;
