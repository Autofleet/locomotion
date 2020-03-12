import React, { Fragment, useState, useEffect } from 'react';
import {
  View,
  Image,
} from 'react-native';
import moment from 'moment';

import I18n from '../../../I18n';
import {
  Drawer, RideButton, PreRideBox,RideButtonContainer, StopPointsEtaContainer,RideStatusText,RideStatusContainer
} from './styled';
import StopPointRow from './StopPointRow';
import StopPointEta from './StopPointEta';
import RideType from './RideType';
import Switch from '../../../Components/Switch'
import NumberOfPassenger from './NumberOfPassenger';
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
  onNumberOfPassengerChange, numberOfPassenger
}) => {
  const [origin, destination] = activeRide ? activeRide.stop_points || [] : [];
  const [isPopupOpen, togglePopup] = getTogglePopupsState();
  const [appSettings, setAppSettings] = useState({})
  const [pickupEta, setPickupEta] = useState(null)
  const [dropoffEta, setDropoffpEta] = useState(null)
  const rideState = getRideState(activeRide);
  const onCreateRide = () => (readyToBook ? createRide() : null);
  const useSettings = settingsContext.useContainer();

  useEffect(() => {
    getSettings();
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

  const getSettings = async () => {
    const { data: response } = await network.get('api/v1/me/app-settings');
    setAppSettings(response)
  }



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
              rideState  === 'driverOnTheWay' &&
              pickupEta <= useSettings.settingsList.ARRIVE_REMINDER_MIN &&
              pickupEta > 0 ?
              I18n.t(`home.rideStates.${rideState}Eta`, {pickupEta, dropoffEta})
            : null}

            {
              rideState  === 'driverOnTheWay' &&
              pickupEta > useSettings.settingsList.ARRIVE_REMINDER_MIN ?
              I18n.t(`home.rideStates.${rideState}`, {pickupEta, dropoffEta})
            : null}

            {
              rideState  === 'driverOnTheWay' &&
              pickupEta <= 0 ?
              I18n.t(`home.rideStates.${rideState}Soon`, {pickupEta, dropoffEta})
            : null}

          </RideStatusText>
        </RideStatusContainer>
       : null}

      {rideState && pickupEta <= appSettings.ARRIVE_REMINDER_MIN ?
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

      {!rideState ? (
        <Fragment>
           <StopPointRow
          pickup
          useBorder
          openLocationSelect={openLocationSelect}
          description={rideState ? origin && origin.description
            : requestStopPoints && requestStopPoints.pickup && requestStopPoints.pickup.description}
            eta={rideState ? origin && origin.eta : undefined}
            completedAt={rideState ? origin && origin.completed_at
              : undefined}
          />
        <StopPointRow
          useBorder
          openLocationSelect={openLocationSelect}
          description={rideState ? destination && destination.description
            : requestStopPoints && requestStopPoints.dropoff && requestStopPoints.dropoff.description}
            eta={rideState ? destination && destination.eta : undefined}
            completedAt={rideState ? destination && destination.completed_at
              : undefined}
          />
          <NumberOfPassenger onChange={onNumberOfPassengerChange} amount={numberOfPassenger} />
          {/* <Switch onChange={(active) => setRideType(active ? 'pool' : 'private')} active={rideType === 'pool'} /> */}
          {/*preRideDetails.eta || preRideDetails.estimatePrice ? ( <PreRideBox {...preRideDetails} /> ) : null */}
        </Fragment>
      ) : null }

      {rideState === 'onBoard' ? null
        : (
          <RideButtonContainer>
            <RideButton
              onPress={rideState ? cancelRide : onCreateRide}
              hollow={!!readyToBook}>
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