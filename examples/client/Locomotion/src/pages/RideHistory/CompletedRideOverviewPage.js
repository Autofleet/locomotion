import React, { useEffect, useContext, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MAIN_ROUTES } from '../routes';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import {
  PageContent,
} from './styled';
import Mixpanel from '../../services/Mixpanel';
import { rideHistoryContext, RideHistoryContextProvider } from '../../context/rideHistory';
import { PageContainer } from '../styles';
import RideView from './RideCard';
import useBackHandler from '../../lib/useBackHandler';

const Page = ({ menuSide }) => {
  const { rides } = useContext(rideHistoryContext);

  const navigation = useNavigation();
  const route = useRoute();
  const [ride, setRide] = useState();

  useEffect(() => {
    Mixpanel.pageView(route.name);
  }, []);

  const { rideId } = (route.params || {});

  useBackHandler(() => {
    navigation.navigate(MAIN_ROUTES.RIDE_HISTORY);
    return true;
  });

  useEffect(() => {
    const find = rides && rides.find(({ id }) => (id === rideId));
    if (find) {
      setRide(find);
    } else {
      navigation.navigate(MAIN_ROUTES.HOME);
    }
  }, [rideId]);

  return (
    <PageContainer>
      <PageContent>
        <PageHeader
          title={i18n.t('rideHistory.tripPageTitle')}
          onIconPress={() => navigation.navigate(MAIN_ROUTES.RIDE_HISTORY)}
          iconSide={menuSide}
        />
        {ride ? (
          <RideView
            ride={ride}
          />
        ) : (
          <></>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default Page;
