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
  AcceptOfferButton,
  PreRideBox,
  RideButtonContainer,
  StopPointsEtaContainer,
  RideStatusText,
  RideStatusContainer,
  CloseContainer,
  ResetInputIcon,
  DrawerContainer,
  DrawerButtonContainer,
  OfferExpiredText,
} from './styled';
import StopPointRow from './StopPointRow';
import StopPointEta from './StopPointEta';
import StopPointRowOffer from './StopPointRowOffer';
import RideType from './RideType';
import Switch from '../../../Components/Switch';
import NumberOfPassenger from './NumberOfPassenger';
import NumberOfPassengerOffer from './NumberOfPassengerOffer';
import RoundedButton from '../../../Components/RoundedButton';
import RideButton from '../../../Components/RideButton';
import RideCard from './RideCard';
import MessageCard from './MessageCard';
import { getTogglePopupsState } from '../../../context/main';
import network from '../../../services/network';
import settingsContext from '../../../context/settings';
import SliderButton from '../../../Components/SlideButton';

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
  onNumberOfPassengerChange, numberOfPassenger, createOffer, rideOffer, cancelOffer, offerExpired,
}) => {
  const [origin, destination] = activeRide ? activeRide.stop_points || [] : [];
  const [isPopupOpen, togglePopup] = getTogglePopupsState();
  const [appSettings, setAppSettings] = useState({});
  const [pickupEta, setPickupEta] = useState(null);
  const [dropoffEta, setDropoffpEta] = useState(null);
  const [loading, setLoading] = useState(false);
  const rideState = getRideState(activeRide);
  const sliderRef = useRef(null);
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
              {rideState
                ? (
                  <RideStatusContainer>
                    <RideStatusText state={rideState}>
                      {
              rideState === 'driverOnTheWay'
                ? pickupEta <= useSettings.settingsList.ARRIVE_REMINDER_MIN && pickupEta > 0
                  ? I18n.t(`home.rideStates.${rideState}Eta`, { pickupEta, dropoffEta })
                  : pickupEta > useSettings.settingsList.ARRIVE_REMINDER_MIN ? I18n.t(`home.rideStates.${rideState}`, { pickupEta, dropoffEta })
                    : pickupEta <= 0 ? I18n.t(`home.rideStates.${rideState}Soon`, { pickupEta, dropoffEta }) : null
                : null
            }
                      {
              rideState === 'onBoard'
                ? dropoffEta > 0
                  ? I18n.t(`home.rideStates.${rideState}`, { pickupEta, dropoffEta }) : I18n.t(`home.rideStates.${rideState}Soon`, { pickupEta, dropoffEta })
                : null
            }
                      {
              rideState === 'driverArrived'
                ? I18n.t(`home.rideStates.${rideState}`, { pickupEta, dropoffEta }) : null
            }
                    </RideStatusText>
                  </RideStatusContainer>
                )
                : null}

              {rideState && (pickupEta <= useSettings.settingsList.ARRIVE_REMINDER_MIN || rideState !== 'driverOnTheWay')
                ? <RideCard activeRide={activeRide} rideState={rideState} />
                : rideState
                  ? (
                    <Fragment>
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
                      </StopPointsEtaContainer>
                      <DrawerButtonContainer>
                        <AcceptOfferButton
                          onPress={buttonAction}
                          hollow
                        >
                          {` ${I18n.t(rideState ? 'home.cancelRideButton' : 'home.letsRideButton')} `}
                        </AcceptOfferButton>
                      </DrawerButtonContainer>
                    </Fragment>
                  )
                  : null
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
                  {/* preRideDetails.eta || preRideDetails.estimatePrice ? ( <PreRideBox {...preRideDetails} /> ) : null */}
                </Fragment>
              ) : null }

              {!rideState && rideOffer ? (
                <Fragment>
                  {!loading
                    ? (
                      <CloseContainer onPress={cancelOffer}>
                        <ResetInputIcon />
                      </CloseContainer>
                    ) : null}
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
                  <NumberOfPassengerOffer amount={rideOffer.numberOfPassengers} />

                  {!offerExpired
                    ? (
                      <SliderButton
                        onVerified={buttonAction}
                        setLoading={setLoading}
                      />
                    )

                    : (
                      <DrawerButtonContainer>
                        <OfferExpiredText>
                          {`${offerExpired ? I18n.t('home.offerCard.expiredOfferText') : ''}`}

                        </OfferExpiredText>

                        <AcceptOfferButton
                          onPress={buttonAction}
                          setLoading={setLoading}
                          hollow={offerExpired}
                        >
                          {`${I18n.t(!offerExpired ? 'home.offerCard.confirmOffer' : 'home.offerCard.expiredOffer')}`}
                        </AcceptOfferButton>
                      </DrawerButtonContainer>
                    )
                  }
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
            >
              {` ${I18n.t(rideState ? 'home.cancelRideButton' : 'home.letsRideButton')} `}
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
