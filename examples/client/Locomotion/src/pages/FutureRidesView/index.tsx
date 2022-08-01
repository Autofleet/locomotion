import React, {
  useContext, useRef, useState, useEffect,
} from 'react';
import bottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet';
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
import { BS_PAGES } from '../../context/ridePageStateContext/utils';
import BlackOverlay from '../../Components/BlackOverlay';
import GenericErrorPopup from '../../popups/GenericError';
import { NoRidesInList } from '../RideHistory/RidesList/styled';

interface FutureRidesViewProps {
  menuSide: 'right' | 'left';
}
const FutureRidesView = ({ menuSide }: FutureRidesViewProps) => {
  const [rideToCancel, setRideToCancel] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const bottomSheetRef = useRef<bottomSheet>(null);
  const {
    futureRides, loadFutureRides,
  } = useContext(FutureRidesContext);
  const { changeBsPage, currentBsPage } = useContext(RideStateContextContext);
  const { cancelRide, getServices, ride } = useContext(RidePageContext);
  const onPressCancel = (id?: string) => {
    setRideToCancel(id || null);
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
        {futureRides.length ? (
          <>
            {(futureRides || []).map((fRide) => {
              const service = services.find(s => s.id === fRide.serviceId);
              return (
                <RideCard
                  ride={fRide}
                  onPress={() => onPressCancel(fRide?.id)}
                  serviceName={service?.displayName}
                  paymentMethod={fRide?.payment?.paymentMethod}
                  scheduledTo={fRide.scheduledTo || ''}
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
              await cancelRide(rideToCancel);
              await loadFutureRides();
              changeBsPage(ride.id ? BS_PAGES.ACTIVE_RIDE : BS_PAGES.ADDRESS_SELECTOR);
              if (futureRides.length === 1) {
                NavigationService.navigate(MAIN_ROUTES.HOME);
              }
            } catch {
              setShowError(true);
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
