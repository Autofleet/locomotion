import React, { useContext, useState } from 'react';
import moment from 'moment';
import { Share } from 'react-native';
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
import phone from '../../../assets/bottomSheet/phone.svg';
import share from '../../../assets/bottomSheet/share.svg';
import cancel from '../../../assets/bottomSheet/cancel.svg';
import RideNotes from '../../../popups/RideNotes';

const DEFAULT_VEHICLE_IMAGE = 'https://res.cloudinary.com/autofleet/image/upload/w_700,h_500,c_thumb,q_auto/vehicle-images/Minivan/minivan_blue.png';

const ActiveRideContent = () => {
  const { ride, trackRide } = useContext(RidePageContext);
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

  const renderContactDriver = () => (
    <ButtonContainer onPress={() => {
      // setPopupToShow('notes');
    }}
    >
      <GenericRideButton
        icon={phone}
        title={i18n.t('bottomSheetContent.ride.contactDriver')}
      />
    </ButtonContainer>
  );

  const renderCancelRide = () => (
    <ButtonContainer onPress={() => {
      // setPopupToShow('notes');
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
    const result = await Share.share({
      message: trackerUrl,
      url: trackerUrl,
    });
  };

  const renderShareRide = () => (
    <ButtonContainer onPress={() => {
      onShare();
    }}
    >
      <GenericRideButton
        icon={share}
        title={i18n.t('bottomSheetContent.ride.shareRide')}
      />
    </ButtonContainer>
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
              <VehicleImage source={{ uri: (vehicle && vehicle.image) || DEFAULT_VEHICLE_IMAGE }} />
              <VehiclePlateContainer>
                <VehiclePlateText>{(vehicle && vehicle.licensePlate) || ''}</VehiclePlateText>
              </VehiclePlateContainer>
            </VehicleDetails>
          </TopContainer>
          <StopPointTextContainer>
            <StopPointText>
              {getTextBasedOnStopPoints()}
            </StopPointText>
            <StopPointsTimeContainer>
              <PulseContainer>
                <Loader dark={false} sourceProp={pulse} lottieViewStyle={{ width: 24, height: 24 }} />
              </PulseContainer>
              <StopPointTimeText>{getMinDifferent()}</StopPointTimeText>
            </StopPointsTimeContainer>
          </StopPointTextContainer>
          <ButtonsContainer>
            <RowContainer>
              {renderContactDriver()}
              {renderRideNotes()}
            </RowContainer>
            <RowContainer>
              {renderCancelRide()}
              {renderShareRide()}
            </RowContainer>
          </ButtonsContainer>
          <StopPointsVerticalViewContainer>
            <StopPointsVerticalView
              ride={ride}
            />
          </StopPointsVerticalViewContainer>
          <RideNotes
            notes={firstSpNotCompleted?.notes}
            isVisible={popupToShow === 'notes'}
            onSubmit={(text: string) => {
            //   updateRide({
            //     notes: text,
            //   });
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
