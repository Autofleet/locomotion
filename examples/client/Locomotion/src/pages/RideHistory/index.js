import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MAIN_ROUTES } from '../routes';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import {
  PageContent, NoRidesMessageContainer, NoRidesTitle, NoRidesTitleText, NoRidesTitleSubText,
} from './styled';
import RideHistoryTable from '../../Components/RideHistoryTable';
import Mixpanel from '../../services/Mixpanel';
import { getRidesHistory } from '../../context/rides/api';
import { PageContainer } from '../styles';

const NoRidesMessage = () => (
  <NoRidesMessageContainer>
    <NoRidesTitle>
      <NoRidesTitleText>{i18n.t('rideHistory.noRides')}</NoRidesTitleText>
      <NoRidesTitleSubText>{i18n.t('rideHistory.noRidesSubText')}</NoRidesTitleSubText>
    </NoRidesTitle>
  </NoRidesMessageContainer>
);

export default ({ menuSide }) => {
  const [rides, setRides] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const getRides = async () => {
    const history = await getRidesHistory();
    if (history && history.rides) {
      setRides(history.rides);
    }
  };

  useEffect(() => {
    Mixpanel.pageView(route.name);
    getRides();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('willFocus', () => {
      getRides();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <PageContainer>
      <PageContent>
        <PageHeader
          title={i18n.t('rideHistory.pageTitle')}
          onIconPress={() => navigation.navigate(MAIN_ROUTES.HOME)}
          iconSide={menuSide}
        />
        {rides && rides.length > 0
          ? <RideHistoryTable data={rides} />
          : <NoRidesMessage />
          }
      </PageContent>
    </PageContainer>
  );
};
