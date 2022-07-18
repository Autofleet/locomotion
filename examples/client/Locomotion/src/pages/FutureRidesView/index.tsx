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

const FutureRidesView = ({ menuSide }) => {
  const [rideToCancel, setRideToCancel] = useState<RideInterface | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const bottomSheetRef = useRef<bottomSheet>(null);
  const {
    futureRides, loadFutureRides,
  } = useContext(FutureRidesContext);
  const { changeBsPage } = useContext(RideStateContextContext);
  const { cancelRide, getServices } = useContext(RidePageContext);
  const onPressCancel = (ride: RideInterface) => {
    setRideToCancel(ride);
    changeBsPage(BS_PAGES.CANCEL_RIDE);
    if (bottomSheetRef?.current) {
      bottomSheetRef?.current.snapToIndex(0);
    }
  };

  const closeBottomSheet = () => {
    if (bottomSheetRef?.current) {
      bottomSheetRef.current.forceClose();
    }
  };

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
        title={i18n.t('postRide.pageTitle')}
        onIconPress={() => NavigationService.navigate(MAIN_ROUTES.HOME)}
        iconSide={menuSide}
      />
      {!!services.length && (
      <ContentContainer>
        {(futureRides || []).map((ride) => {
          const service = services.find(s => s.id === ride.serviceId);
          return (
            <RideCard
              ride={ride}
              onPress={onPressCancel}
              serviceName={service.displayName}
              paymentMethod={ride.payment.paymentMethod}
              scheduledTo={ride.scheduledTo || ''}
            />
          );
        })}
      </ContentContainer>
      )}
      <BottomSheetComponent
        ref={bottomSheetRef}
        enablePanDownToClose
        index={-1}
        closeable
        style={{
          zIndex: 3,
          elevation: 5,
        }}
      >
        <CancelRide
          onButtonPress={() => {
            closeBottomSheet();
            if (futureRides.length === 1) {
              changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
              NavigationService.navigate(MAIN_ROUTES.HOME);
            }
            cancelRide(rideToCancel?.id);
            loadFutureRides();
          }}
          onSecondaryButtonPress={() => {
            closeBottomSheet();
          }}
        />
      </BottomSheetComponent>
    </PageContainer>
  );
};

export default FutureRidesView;
