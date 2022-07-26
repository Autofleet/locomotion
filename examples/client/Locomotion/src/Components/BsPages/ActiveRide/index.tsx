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
  ButtonsContainer, RowContainer, ButtonContainer,
} from './styled';
import { STOP_POINT_STATES } from '../../../lib/commonTypes';
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
  const { ride, trackRide, updateRide } = useContext(RidePageContext);
  const { changeBsPage, setGenericErrorPopup } = useContext(RideStateContextContext);
  const [popupToShow, setPopupToShow] = useState<string | null>(null);

  const {
    vehicle,
  } = ride;

  const { stopPoints } = ride;

  const firstSpNotCompleted = stopPoints?.find(p => p.state !== STOP_POINT_STATES.COMPLETED);

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
    const rideHasNotes = firstSpNotCompleted?.notes;
    return (
      <ButtonContainer onPress={() => {
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
    <ButtonContainer
      disabled={!ride.cancelable}
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
  );

  const onShare = async () => {
    const trackerUrl = await trackRide();
    await Share.share({
      message: trackerUrl,
      url: trackerUrl,
    });
  };

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
        <>
          <TopContainer>
            <DriverCardContainer>
              <DriverCard
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
            <StopPointText>
              {getTextBasedOnStopPoints()}
            </StopPointText>
            <StopPointsTimeContainer>
              <PulseContainer>
                <Loader
                  dark={false}
                  sourceProp={pulse}
                  lottieViewStyle={{ width: 24, height: 24 }}
                />
              </PulseContainer>
              <StopPointTimeText>{getMinDifferent()}</StopPointTimeText>
            </StopPointsTimeContainer>
          </StopPointTextContainer>
          <ButtonsContainer>
            <RowContainer>
              <Call
                onError={() => {
                  setGenericErrorPopup({});
                }}
              />
              {renderRideNotes()}
            </RowContainer>
            <RowContainer>
              {renderCancelRide()}
              {renderShareRide()}
            </RowContainer>
          </ButtonsContainer>
          <StopPointsVerticalView
            ride={ride}
          />
          <RidePaymentDetails
            rideId={ride.id}
            paymentMethod={ride.payment?.paymentMethod}
            state={ride.state}
            currency={ride.priceCurrency}
          />
          <ServiceTypeDetails
            serviceType={ride.serviceType}
          />
          <RideNotes
            notes={firstSpNotCompleted?.notes}
            isVisible={popupToShow === 'notes'}
            onSubmit={(text: string) => {
              updateRide(ride.id, {
                stopPoints: [{
                  id: firstSpNotCompleted.id,
                  notes: text,
                }],
              });
              clearPopup();
            }}
            onCancel={() => {
              clearPopup();
            }}
          />
        </>
      )}
    </>
  );
};

export default ActiveRideContent;
