import React, { Fragment, useEffect, useState } from 'react';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import RideHistoryService from '../../services/ride-history';
import { NoRidesMessage } from './styled';
import RideHistoryTable from '../../Components/RideHistoryTable';

export default ({ navigation }) => {
  const [rides, setRides] = useState({});
  const [noRides, setNoRides] = useState(true);

  const toggleMenu = () => {
    navigation.toggleDrawer();
  };

  const getRides = async () => {
    const history = await RideHistoryService.getHistory();
    if (history && history.rides) {
      setRides(history.rides);
      setNoRides(false);
    } else {
      setNoRides(true);
    }
  };

  useEffect(() => {
    getRides();
  }, []);

  return (
    <Fragment>
      <PageHeader
        title={i18n.t('rideHistory.pageTitle')}
        onIconPress={() => toggleMenu()}
      />
      {!noRides
        ? <RideHistoryTable data={rides} />
        : <NoRidesMessage>{i18n.t('rideHistory.noRides')}</NoRidesMessage>
      }
    </Fragment>
  );
};
