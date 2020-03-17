import React, { Fragment, useState, useEffect } from 'react';
import {
  View,
  Image,
} from 'react-native';
import moment from 'moment';

import I18n from '../../../I18n';
import {
  Drawer, RideButton, PreRideBox,RideButtonContainer, StopPointsEtaContainer,RideStatusText,RideStatusContainer,CloseContainer, ResetInputIcon
} from './styled';
import StopPointRow from './StopPointRow';
import StopPointEta from './StopPointEta';
import StopPointRowOffer from './StopPointRowOffer';
import RideType from './RideType';
import Switch from '../../../Components/Switch'
import NumberOfPassenger from './NumberOfPassenger';
import NumberOfPassengerOffer from './NumberOfPassengerOffer';
import RoundedButton from '../../../Components/RoundedButton';
import RideCard from './RideCard';
import MessageCard from './MessageCard';
import { getTogglePopupsState } from '../../../context/main'
import network from '../../../services/network'
import settingsContext from '../../../context/settings'


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
  onNumberOfPassengerChange, numberOfPassenger,createOffer,rideOffer, cancelOffer
}) => {
  const [origin, destination] = activeRide ? activeRide.stop_points || [] : [];
  const [isPopupOpen, togglePopup] = getTogglePopupsState();
  const [appSettings, setAppSettings] = useState({})
  const [pickupEta, setPickupEta] = useState(null)
  const [dropoffEta, setDropoffpEta] = useState(null)
  const rideState = getRideState(activeRide);

  const buttonAction = async () => {
      if(rideState) {
        return cancelRide();
      }

      if(!rideOffer && readyToBook) {
        return createOffer();
      }

      if(rideOffer) {
        return createRide();
      }
  }

  const useSettings = settingsContext.useContainer();

  useEffect(() => {
    useSettings.getSettings();
  }, [])

  useEffect(() => {
    if(origin && origin.eta) {
      const etaDiff = moment(origin.eta).diff(moment(), 'minutes');
      setPickupEta(etaDiff)
    }

    if(destination && destination.eta) {
      const etaDiff = moment(destination.eta).diff(moment(), 'minutes');
      setDropoffpEta(etaDiff)
    }
  }, [origin, destination])

  return (
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
    {!isPopupOpen('ridePopupsStatus') ?
    <Fragment>
      {rideState ?
        <RideStatusContainer>
          <RideStatusText state={rideState}>
            {
              rideState  === 'driverOnTheWay' ?
                pickupEta <= useSettings.settingsList.ARRIVE_REMINDER_MIN && pickupEta > 0 ?
                  I18n.t(`home.rideStates.${rideState}Eta`, {pickupEta, dropoffEta}) :
                  pickupEta > useSettings.settingsList.ARRIVE_REMINDER_MIN ? I18n.t(`home.rideStates.${rideState}`, {pickupEta, dropoffEta}) :
                    pickupEta <= 0 ? I18n.t(`home.rideStates.${rideState}Soon`, {pickupEta, dropoffEta}) : null
              : null
            }
            {
              rideState  === 'onBoard' ?
                dropoffEta > 0 ?
                I18n.t(`home.rideStates.${rideState}`, {pickupEta, dropoffEta}) : I18n.t(`home.rideStates.${rideState}Soon`, {pickupEta, dropoffEta})
              : null
            }
            {
              rideState === 'driverArrived' ?
              I18n.t(`home.rideStates.${rideState}`, {pickupEta, dropoffEta}) : null
            }
          </RideStatusText>
        </RideStatusContainer>
       : null}

      {rideState && (pickupEta <= useSettings.settingsList.ARRIVE_REMINDER_MIN || rideState !== 'driverOnTheWay')  ?
        <RideCard activeRide={activeRide} rideState={rideState}></RideCard> :
          rideState ?
          <StopPointsEtaContainer>
            <StopPointEta
              pickup
              useBorder
              openLocationSelect={openLocationSelect}
              description={rideState ? origin && origin.description
                : requestStopPoints && requestStopPoints.pickup && requestStopPoints.pickup.description}
                eta={rideState ? origin && origin.eta : undefined}
                completedAt={rideState ? origin && origin.completed_at
                  : undefined}
                etaDrift={useSettings.settingsList.DISPLAY_ETA_DRIFT}
              />
            <StopPointEta
              useBorder
              openLocationSelect={openLocationSelect}
              description={rideState ? destination && destination.description
                : requestStopPoints && requestStopPoints.dropoff && requestStopPoints.dropoff.description}
                eta={rideState ? destination && destination.eta : undefined}
                completedAt={rideState ? destination && destination.completed_at
                  : undefined}
                etaDrift={useSettings.settingsList.DISPLAY_MAX_ETA_DRIFT}
              />
            </StopPointsEtaContainer> : null
      }

      {!rideState && !rideOffer ? (
        <Fragment>
           <StopPointRow
              pickup
              useBorder={rideOffer === null}
              openLocationSelect={openLocationSelect}
              description={rideState ? origin && origin.description
                : requestStopPoints && requestStopPoints.pickup && requestStopPoints.pickup.description}
                completedAt={rideState ? origin && origin.completed_at
                  : undefined}
          />
          <StopPointRow
            useBorder
            openLocationSelect={openLocationSelect}
            description={rideState ? destination && destination.description
              : requestStopPoints && requestStopPoints.dropoff && requestStopPoints.dropoff.description}
              completedAt={rideState ? destination && destination.completed_at
                : undefined}
          />
          <NumberOfPassenger onChange={onNumberOfPassengerChange} amount={numberOfPassenger} />
          {/* <Switch onChange={(active) => setRideType(active ? 'pool' : 'private')} active={rideType === 'pool'} /> */}
          {/*preRideDetails.eta || preRideDetails.estimatePrice ? ( <PreRideBox {...preRideDetails} /> ) : null */}
        </Fragment>
      ) : null }

      {!rideState && rideOffer ? (
        <Fragment>
          <CloseContainer onPress={cancelOffer}>
                <ResetInputIcon />
            </CloseContainer>
           <StopPointRowOffer
              pickup
              useBorder={rideOffer === null}
              openLocationSelect={openLocationSelect}
              description={rideState ? origin && origin.description
                : requestStopPoints && requestStopPoints.pickup && requestStopPoints.pickup.description}
              eta={rideState ? origin && origin.eta : undefined}
              completedAt={rideState ? origin && origin.completed_at : undefined}
              rideOffer={rideOffer}
              etaDrift={useSettings.settingsList.DISPLAY_ETA_DRIFT}
          />
          <StopPointRowOffer
            useBorder
            openLocationSelect={openLocationSelect}
            description={rideState ? destination && destination.description
              : requestStopPoints && requestStopPoints.dropoff && requestStopPoints.dropoff.description}
              eta={rideState ? destination && destination.eta : undefined}
              completedAt={rideState ? destination && destination.completed_at
                : undefined}
              rideOffer={rideOffer}
              etaDrift={useSettings.settingsList.DISPLAY_MAX_ETA_DRIFT}
          />
          <NumberOfPassengerOffer onChange={onNumberOfPassengerChange} amount={numberOfPassenger} />
        </Fragment>
      ) : null }

      {rideState === 'onBoard' ? null
        : (
          <RideButtonContainer>
            <RideButton
              onPress={buttonAction}
              hollow={!readyToBook}>
              {` ${I18n.t(rideState ? 'home.cancelRideButton' : 'home.letsRideButton')} `}
            </RideButton>
          </RideButtonContainer>
        )
      }
      </Fragment> : null}
    </Drawer>
  );
};

export default RideDrawer;
console.disableYellowBox = true;