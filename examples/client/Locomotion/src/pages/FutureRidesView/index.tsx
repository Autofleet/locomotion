import React, {
  useContext, useRef, useState, useEffect,
} from 'react';
import bottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet';
import moment from 'moment';
import { FutureRidesContext } from '../../context/futureRides';
import { PageContainer } from '../styles';
import { ContentContainer } from './styled';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import * as NavigationService from '../../services/navigation';
import { MAIN_ROUTES } from '../routes';
import RideCard from '../../Components/RideCard';
import BottomSheetComponent from '../../Components/BottomSheet';
import { CancelRide } from '../../Components/BsPages';
import { RideStateContextContext } from '../..';
import { RideInterface, RidePageContext } from '../../context/newRideContext';
import { convertTimezoneByLocation } from '../../context/newRideContext/utils';

import { BS_PAGES } from '../../context/ridePageStateContext/utils';
import BlackOverlay from '../../Components/BlackOverlay';
import GenericErrorPopup from '../../popups/GenericError';
import { NoRidesInList } from '../RideHistory/RidesList/styled';
import Mixpanel from '../../services/Mixpanel';

interface FutureRidesViewProps {
  menuSide: 'right' | 'left';
}
const FutureRidesView = ({ menuSide }: FutureRidesViewProps) => {
  const [rideToCancel, setRideToCancel] = useState<string | undefined>(undefined);
  const [showError, setShowError] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [localFutureRides, setLocalFutureRides] = useState<any[]>([]);
  const bottomSheetRef = useRef<bottomSheet>(null);
  const {
    futureRides, loadFutureRides,
  } = useContext(FutureRidesContext);
  const { changeBsPage, currentBsPage } = useContext(RideStateContextContext);
  const { cancelRide, getServices, ride } = useContext(RidePageContext);
  const onPressCancel = (id?: string) => {
    setRideToCancel(id);
    changeBsPage(BS_PAGES.CANCEL_RIDE);
  };

  useEffect(() => {
    if (currentBsPage === BS_PAGES.CANCEL_RIDE) {
      if (bottomSheetRef?.current) {
        bottomSheetRef?.current.snapToIndex(0);
      }
    } else if (bottomSheetRef?.current) {
      bottomSheetRef?.current.close();
    }
  }, [currentBsPage]);

  const loadServices = async () => {
    const res = await getServices();
    setServices(res);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const convertRideScheduledTo = async (ride) => {
    const { stopPoints, scheduledTo } = ride;
    const unixScheduledTo = moment.utc(scheduledTo);
    const convertedTime = await convertTimezoneByLocation(stopPoints[0].lat, stopPoints[0].lng, unixScheduledTo, false);
    ride.scheduledTo = convertedTime;
    return ride;
  };

  const formatRides = async (rides = []) => {
    const formattedRides = await Promise.all(rides.map(async (fride) => {
      const formattedTime = await convertRideScheduledTo(fride);
      return formattedTime;
    }));
    setLocalFutureRides(formattedRides);
  };

  useEffect(() => {
    formatRides(futureRides);
  }, [futureRides]);

  return (
    <PageContainer>
      <PageHeader
        title={i18n.t('futureRides.pageTitle')}
        onIconPress={() => {
          changeBsPage(ride.id ? BS_PAGES.ACTIVE_RIDE : BS_PAGES.ADDRESS_SELECTOR);
          NavigationService.navigate(MAIN_ROUTES.HOME);
        }}
        iconSide={menuSide}
      />
      <ContentContainer>
        {localFutureRides.length ? (
          <>
            {(localFutureRides || []).map((fRide) => {
              const service = services.find(s => s.id === fRide.serviceId);
              return (
                <RideCard
                  ride={fRide}
                  onPress={() => onPressCancel(fRide?.id)}
                  serviceName={service?.displayName}
                  paymentMethod={fRide?.payment?.paymentMethod}
                  scheduledTo={fRide?.scheduledTo || ''}
                />
              );
            })}
          </>
        ) : (
          <NoRidesInList
            title={i18n.t('futureRides.noRidesTitle')}
            text={i18n.t('futureRides.noRidesText')}
          />
        )}
      </ContentContainer>
      {currentBsPage === BS_PAGES.CANCEL_RIDE
        ? <BlackOverlay />
        : null}
      <BottomSheetComponent
        ref={bottomSheetRef}
        enablePanDownToClose
        index={-1}
        closeable
      >
        <CancelRide
          secondaryButtonText={i18n.t('bottomSheetContent.cancelRide.secondaryButtonTextFuture')}
          onButtonPress={async () => {
            try {
              Mixpanel.setEvent('Trying to cancel ride');
              await cancelRide(rideToCancel);
              await loadFutureRides();
              changeBsPage(ride.id ? BS_PAGES.ACTIVE_RIDE : BS_PAGES.ADDRESS_SELECTOR);
              if (futureRides.length === 1) {
                NavigationService.navigate(MAIN_ROUTES.HOME);
              }
            } catch (e: any) {
              setShowError(true);
              Mixpanel.setEvent('failed to cancel ride', { status: e?.response?.status });
            }
          }}
          onSecondaryButtonPress={() => {
            changeBsPage(ride.id ? BS_PAGES.ACTIVE_RIDE : BS_PAGES.ADDRESS_SELECTOR);
          }}
        />
      </BottomSheetComponent>
      <GenericErrorPopup
        isVisible={showError}
        closePopup={() => setShowError(false)}
      />
    </PageContainer>
  );
};

export default FutureRidesView;
