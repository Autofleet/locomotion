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

import StopPointsEtaCard from './StopPointsEtaCard'
import StopPointsCard from './StopPointsCard'
import OfferCard from './OfferCard'
import RideStatusHeader from './RideStatusHeader'

const getRideState = (activeRide) => { // false, driverOnTheWay, driverArrived, onBoard
  if (!activeRide) {
    return false;
  }
  if (activeRide.stop_points[0].completed_at) {
    return 'onBoard';
  }
  if (activeRide.stop_points[0].arrived_at) {
    return 'driverArrived';
  }
  return 'driverOnTheWay';
};

const RideDrawer = ({
  activeRide, openLocationSelect, requestStopPoints, setRideType,
  cancelRide, createRide, readyToBook, rideType, preRideDetails,
  onNumberOfPassengerChange, numberOfPassenger, createOffer, rideOffer,
  cancelOffer, offerExpired,onLocationSelect,closeAddressViewer
}) => {
  const [origin, destination] = activeRide ? activeRide.stop_points || [] : [];
  const [isPopupOpen, togglePopup] = getTogglePopupsState();
  const [appSettings, setAppSettings] = useState({});
  const [pickupEta, setPickupEta] = useState(null);
  const [dropoffEta, setDropoffpEta] = useState(null);
  const [loading, setLoading] = useState(false);
  const rideState = getRideState(activeRide);

  const buttonAction = async () => {
    if (rideState) {
      return cancelRide();
    }

    if ((!rideOffer && readyToBook) || (rideOffer && offerExpired)) {
      return createOffer();
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

  return (
    <DrawerContainer>
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
        {!isPopupOpen('ridePopupsStatus')
          ? (
            <Fragment>
              <RideStatusHeader
                rideState={rideState}
                pickupEta={pickupEta}
                dropoffEta={dropoffEta}
                arrivingReminderMin={useSettings.settingsList.ARRIVE_REMINDER_MIN}
              />

              {rideState && (pickupEta <= useSettings.settingsList.ARRIVE_REMINDER_MIN || rideState !== 'driverOnTheWay')
                ? <RideCard activeRide={activeRide} rideState={rideState} />
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
