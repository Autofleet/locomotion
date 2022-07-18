import React, { useContext, useRef } from 'react';
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

const FutureRidesView = ({ menuSide }) => {
  const bottomSheetRef = useRef(null);
  const {
    futureRides,
  } = useContext(FutureRidesContext);
  const onPressCancel = () => {
    bottomSheetRef?.current.snapToIndex(0);
  };
  return (
    <PageContainer>
      <PageHeader
        title={i18n.t('postRide.pageTitle')}
        onIconPress={() => NavigationService.navigate(MAIN_ROUTES.HOME)}
        iconSide={menuSide}
      />
      <ContentContainer>
        {(futureRides || []).map(ride => <RideCard ride={ride} />)}
      </ContentContainer>
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
        <CancelRide />
      </BottomSheetComponent>
    </PageContainer>
  );
};

export default FutureRidesView;
