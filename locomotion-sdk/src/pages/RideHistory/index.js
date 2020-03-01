import React, { Fragment, useEffect, useState } from 'react';
import { Text } from 'react-native';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import RideHistoryService from '../../services/ride-history';
import { NoRidesMessage } from './styled';

export default ({ navigation }) => {
  const [rides, setRides] = useState({});
  const [noRides, setNoRides] = useState(false);

  const toggleMenu = () => {
    navigation.toggleDrawer();
  };


  const getRides = async () => {
    const history = await RideHistoryService.getHistory();
    if (history && history.rides && history.rides.length) {
      setRides(history.rides);
    } else {
      setNoRides(true);
    }
  };

  useEffect(() => {
    getRides();
  });

  return (
    <Fragment>
      <PageHeader
        title={i18n.t(`rideHistory.pageTitle`)}
        onIconPress={() => toggleMenu()}
      />

      {noRides
        ? <NoRidesMessage>{i18n.t(`rideHistory.noRides`)}</NoRidesMessage>
        : <Text>{JSON.stringify(rides)}</Text>
        }
    </Fragment>
  );
};
