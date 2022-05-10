import React, { Fragment, useEffect, useState } from 'react';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import {
  PageContent, NoRidesMessageContainer, NoRidesTitle, NoRidesTitleText, NoRidesTitleSubText,
} from './styled';
import RideHistoryTable from '../../Components/RideHistoryTable';
import Mixpanel from '../../services/Mixpanel';
import { getRidesHistory } from '../../context/rides/api';

const NoRidesMessage = ({ navigation }) => (
  <NoRidesMessageContainer>
    <NoRidesTitle>
      <NoRidesTitleText>{i18n.t('rideHistory.noRides')}</NoRidesTitleText>
      <NoRidesTitleSubText>{i18n.t('rideHistory.noRidesSubText')}</NoRidesTitleSubText>
    </NoRidesTitle>
  </NoRidesMessageContainer>
);

export default ({ navigation,menuSide }) => {
  const [rides, setRides] = useState(null);

  const toggleMenu = () => {
    navigation.toggleDrawer();
  };

  const getRides = async () => {
    const history = await getRidesHistory()
    if (history && history.rides) {
      setRides(history.rides);
    }
  };

  useEffect(() => {
    Mixpanel.pageView(navigation.state.routeName)
    getRides();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('willFocus', () => {
      getRides();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <PageContent>
      <PageHeader
        title={i18n.t('rideHistory.pageTitle')}
        onIconPress={() => toggleMenu()}
        iconSide={menuSide}
      />
      {rides && rides.length > 0
        ? <RideHistoryTable data={rides} />
        : <NoRidesMessage />
      }
    </PageContent>
  );
};
