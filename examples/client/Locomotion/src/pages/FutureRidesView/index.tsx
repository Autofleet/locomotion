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
import { SNAP_POINT_STATES, BottomSheetContext } from '../../context/bottomSheetContext';
import { BS_PAGES } from '../../context/ridePageStateContext/utils';
import BlackOverlay from '../../Components/BlackOverlay';
import GenericErrorPopup from '../../popups/GenericError';
import { NoRidesInList } from '../RideHistory/RidesList/styled';

interface FutureRidesViewProps {
  menuSide: 'right' | 'left';
}
const FutureRidesView = ({ menuSide }: FutureRidesViewProps) => {
  const [rideToCancel, setRideToCancel] = useState<RideInterface | null>(null);
  const [showError, setShowError] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const bottomSheetRef = useRef<bottomSheet>(null);
  const {
    futureRides, loadFutureRides,
  } = useContext(FutureRidesContext);
  const {
    setSnapPointsState,
    setIsExpanded,
  } = useContext(BottomSheetContext);
  const { cancelRide, getServices } = useContext(RidePageContext);
  const onPressCancel = (ride: RideInterface) => {
    setRideToCancel(ride);
    setSnapPointsState(SNAP_POINT_STATES.CANCEL_RIDE);
    setIsExpanded(false);
    if (bottomSheetRef?.current) {
      bottomSheetRef?.current.snapToIndex(0);
    }
  };

  // useEffect(() => {
  //   if (currentBsPage === BS_PAGES.CANCEL_RIDE) {
  //     if (bottomSheetRef?.current) {
  //       bottomSheetRef?.current.snapToIndex(0);
  //     }
  //   } else if (bottomSheetRef?.current) {
  //     bottomSheetRef?.current.close();
  //   }
  // }, [currentBsPage]);


  const loadServices = async () => {
    const res = await getServices();
    setServices(res);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const clearRideToCancel = () => {
    setRideToCancel(null);
    if (bottomSheetRef?.current) {
      bottomSheetRef?.current.close();
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={i18n.t('futureRides.pageTitle')}
        onIconPress={() => {
          // changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
          NavigationService.navigate(MAIN_ROUTES.HOME);
        }}
        iconSide={menuSide}
      />
      <ContentContainer>
        {futureRides.length ? (
          <>
            {(futureRides || []).map((ride) => {
              const service = services.find(s => s.id === ride.serviceId);
              return (
                <RideCard
                  ride={ride}
                  onPress={() => onPressCancel(ride)}
                  serviceName={service?.displayName}
                  paymentMethod={ride?.payment?.paymentMethod}
                  scheduledTo={ride.scheduledTo || ''}
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
      {rideToCancel
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
              await cancelRide(rideToCancel?.id);
              await loadFutureRides();
              if (futureRides.length === 1) {
                NavigationService.navigate(MAIN_ROUTES.HOME);
              }
            } catch {
              setShowError(true);
            } finally {
              clearRideToCancel();
            }
          }}
          onSecondaryButtonPress={() => {
            clearRideToCancel();
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
