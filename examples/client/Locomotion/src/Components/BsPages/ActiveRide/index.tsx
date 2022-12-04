import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Share } from 'react-native';
import RidePaymentDetails from '../../RidePaymentDetails';
import { BS_PAGES } from '../../../context/ridePageStateContext/utils';
import { RidePageContext } from '../../../context/newRideContext';
import DriverCard from '../../DriverCard';
import {
  TopContainer, VehicleDetails, VehicleImage, VehiclePlateText, VehiclePlateContainer,
  DriverCardContainer, StopPointTextContainer, StopPointText, StopPointsTimeContainer,
  StopPointTimeText, PulseContainer, StopPointsVerticalViewContainer,
  ButtonsContainer, RowContainer, ButtonContainer, Container,
} from './styled';
import { STOP_POINT_STATES, STOP_POINT_TYPES } from '../../../lib/commonTypes';
import i18n from '../../../I18n';
import pulse from '../../../assets/marker-pulse.json';
import Loader from '../../Loader';
import StopPointsVerticalView from '../../StopPointsVerticalView';
import GenericRideButton from '../../GenericRideButton';
import plus from '../../../assets/bottomSheet/plus.svg';
import editNote from '../../../assets/bottomSheet/edit_note.svg';
import share from '../../../assets/bottomSheet/share.svg';
import cancel from '../../../assets/bottomSheet/cancel.svg';
import RideNotes from '../../../popups/RideNotes';
import ServiceTypeDetails from '../../ServiceTypeDetails';
import { RideStateContextContext } from '../../../context/ridePageStateContext';
import Call from './call';
import ShareButton from './share';

const DEFAULT_VEHICLE_IMAGE = 'https://res.cloudinary.com/autofleet/image/upload/w_700,h_500,c_thumb,q_auto/vehicle-images/Minivan/minivan_blue.png';

const ActiveRideContent = () => {
  const { ride, loadRide, updateRide } = useContext(RidePageContext);
  const { changeBsPage, setGenericErrorPopup } = useContext(RideStateContextContext);
  const [popupToShow, setPopupToShow] = useState<string | null>(null);

  const {
    vehicle,
  } = ride;

  const { stopPoints } = ride;

  const firstSpNotCompleted = stopPoints?.find(p => p.state !== STOP_POINT_STATES.COMPLETED);
  const pickupSp = stopPoints?.find(p => p.type === STOP_POINT_TYPES.STOP_POINT_PICKUP);

  const getTextBasedOnStopPoints = () => {
    if (firstSpNotCompleted) {
      return i18n.t(`activeRide.${firstSpNotCompleted.type}.${firstSpNotCompleted.state}`);
    }
  };

  const getMinDifferent = () => {
    if (firstSpNotCompleted) {
      const min = moment(firstSpNotCompleted.plannedArrivalTime).diff(moment(), 'minutes');
      return min < 1 ? i18n.t('now') : i18n.t('min', { min });
    }
  };

  const renderRideNotes = () => {
    const rideHasNotes = pickupSp?.notes;
    return (
      <ButtonContainer
        testID="RideNotes"
        onPress={() => {
          setPopupToShow('notes');
        }}
      >
        <GenericRideButton
          icon={rideHasNotes ? editNote : plus}
          title={i18n.t(rideHasNotes
            ? 'bottomSheetContent.ride.notes.edit'
            : 'bottomSheetContent.ride.notes.add')}
        />
      </ButtonContainer>
    );
  };

  const renderCancelRide = () => (
    ride.cancelable
      ? (
        <ButtonContainer
          testID="cancelRideButton"
          onPress={() => {
            if (ride.cancelable) {
              changeBsPage(BS_PAGES.CANCEL_RIDE);
            }
          }}
        >
          <GenericRideButton
            icon={cancel}
            title={i18n.t('bottomSheetContent.ride.cancelRide')}
          />
        </ButtonContainer>
      )
      : null

  );

  const renderShareRide = () => (
    <ShareButton />
  );

  const clearPopup = () => {
    setPopupToShow(null);
  };

  return (
    <>
      {ride
      && (
        <Container alwaysBounceVertical={false}>
          <TopContainer>
            <DriverCardContainer>
              <DriverCard
                noPaddingLeft={false}
                activeRide
                ride={ride}
              />
            </DriverCardContainer>
            <VehicleDetails>
              <VehicleImage resizeMode="contain" source={{ uri: (vehicle?.image) || DEFAULT_VEHICLE_IMAGE }} />
              <VehiclePlateContainer>
                <VehiclePlateText>{(vehicle?.licensePlate) || ''}</VehiclePlateText>
              </VehiclePlateContainer>
            </VehicleDetails>
          </TopContainer>
          <StopPointTextContainer>
            <StopPointText numberOfLines={1}>
              {getTextBasedOnStopPoints()}
            </StopPointText>
            {firstSpNotCompleted?.state === STOP_POINT_STATES.PENDING
              ? (
                <StopPointsTimeContainer>
                  <PulseContainer>
                    <Loader dark={false} sourceProp={pulse} lottieViewStyle={{ width: 24, height: 24 }} />
                  </PulseContainer>
                  <StopPointTimeText>{getMinDifferent()}</StopPointTimeText>
                </StopPointsTimeContainer>
              )
              : null}
          </StopPointTextContainer>
          <ButtonsContainer>
            {firstSpNotCompleted?.type === 'pickup' ? (
              <>
                <RowContainer>
                  <Call onError={() => { setGenericErrorPopup({}); }} />
                  {renderRideNotes()}
                </RowContainer>
                <RowContainer>
                  {renderCancelRide()}
                  {renderShareRide()}
                </RowContainer>
              </>
            ) : (
              <RowContainer>
                <Call onError={() => { setGenericErrorPopup({}); }} />
                {renderShareRide()}
              </RowContainer>
            )}
          </ButtonsContainer>
          <StopPointsVerticalView
            ride={ride}
          />
          <RidePaymentDetails
            rideId={ride.id || ''}
            paymentMethod={ride.payment?.paymentMethod}
            state={ride.state}
            currency={ride.priceCurrency}
          />
          <ServiceTypeDetails
            serviceType={ride.serviceType}
          />
          <RideNotes
            notes={pickupSp?.notes}
            isVisible={popupToShow === 'notes'}
            onSubmit={async (text: string) => {
              await updateRide(ride.id, {
                stopPoints: [{
                  id: pickupSp.id,
                  notes: text,
                }],
              });
              await loadRide(ride.id || '');
              clearPopup();
            }}
            onCancel={() => {
              clearPopup();
            }}
          />
        </Container>
      )}
    </>
  );
};

export default ActiveRideContent;
