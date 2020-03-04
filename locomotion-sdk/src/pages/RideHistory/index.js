import React, { Fragment, useEffect, useState } from 'react';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import RideHistoryService from '../../services/ride-history';
import {
  PageContent, NoRidesMessageContainer, NoRidesTitle, NoRidesTitleText, NoRidesTitleSubText,
} from './styled';
import RideHistoryTable from '../../Components/RideHistoryTable';

const NoRidesMessage = ({ navigation }) => (
  <NoRidesMessageContainer>
    <NoRidesTitle>
      <NoRidesTitleText>{i18n.t('rideHistory.noRides')}</NoRidesTitleText>
      <NoRidesTitleSubText>{i18n.t('rideHistory.noRidesSubText')}</NoRidesTitleSubText>
    </NoRidesTitle>
  </NoRidesMessageContainer>
);

export default ({ navigation }) => {
  const [rides, setRides] = useState({});

  const toggleMenu = () => {
    navigation.toggleDrawer();
  };

  const getRides = async () => {
    const history = await RideHistoryService.getHistory();
    if (history && history.rides) {
      setRides(history.rides);
    }
  };

  useEffect(() => {
    getRides();
  }, []);

  return (
    <PageContent>
      <PageHeader
        title={i18n.t('rideHistory.pageTitle')}
        onIconPress={() => toggleMenu()}
      />
      {rides && rides.length > 0
        ? <RideHistoryTable data={rides} />
        : <NoRidesMessage />
      }
    </PageContent>
  );
};
