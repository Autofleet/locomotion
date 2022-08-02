import React, { useContext, useState } from 'react';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { MAIN_ROUTES } from '../routes';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import {
  PageContent,
} from './styled';
import Mixpanel from '../../services/Mixpanel';
import { RidePageContext } from '../../context/newRideContext';
import { PageContainer } from '../styles';
import RideView from './RideCard';
import useBackHandler from '../../lib/useBackHandler';
import { formatRides } from '../../context/rideHistory';
import * as navigationService from '../../services/navigation';

const Page = ({ menuSide }) => {
  const { getRideFromApi } = useContext(RidePageContext);
  const route = useRoute();
  const [ride, setRide] = useState();

  const { rideId } = (route.params || {});

  useBackHandler(() => {
    navigationService.navigate(MAIN_ROUTES.RIDE_HISTORY);
    return true;
  });

  const getRideInfo = async () => {
    const res = await getRideFromApi(rideId);
    const [formattedRide] = formatRides([res]);
    setRide(formattedRide);
  };

  useFocusEffect(
    React.useCallback(() => {
      getRideInfo();
    }, [rideId]),
  );

  return (
    <PageContainer>
      <PageContent>
        <PageHeader
          title={i18n.t('rideHistory.tripPageTitle')}
          onIconPress={() => navigationService.navigate(MAIN_ROUTES.RIDE_HISTORY)}
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
