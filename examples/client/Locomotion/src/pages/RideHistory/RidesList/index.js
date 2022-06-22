import React, { useContext, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FILTERS } from '../filters';
import { MAIN_ROUTES } from '../../routes';
import { rideHistoryContext as ridesContext } from '../../../context/rideHistory';
import {
  CenterContainer,
  NoRidesInList,
  RidesViewContainer,
} from './styled';
import Loader from '../../../Components/Loader';
import Mixpanel from '../../../services/Mixpanel';
import { RideListView } from '../RideCard';

const DISTANCE_FROM_END = 400;

const RideCardInList = ({
  showBottomLoader,
  ride,
  lastItem,
  showSpacer,
}) => {
  const navigation = useNavigation();
  const Content = () => (
    <RideListView
      ride={ride}
      showSpacer={showSpacer}
      onPress={() => navigation.navigate(MAIN_ROUTES.COMPLETED_RIDE_OVERVIEW_PAGE, {
        rideId: ride.id,
      })}
    />
  );
  return (lastItem ? (
    <>
      {!showBottomLoader ? (<Content />) : (
        <CenterContainer>
          <Loader />
        </CenterContainer>
      )}
    </>
  ) : <Content />);
};

const RidesView = ({ rides }) => {
  const { loadMoreRides } = useContext(ridesContext);
  const [stopLoading, setStopLoading] = useState(false);
  const [showBottomLoader, setShowBottomLoader] = useState(false);

  const startLoadMoreRides = async ({ distanceFromEnd }) => {
    Mixpanel.setEvent('trying loading more', { distanceFromEnd });
    if (!showBottomLoader && !stopLoading && distanceFromEnd < DISTANCE_FROM_END) {
      await setShowBottomLoader(true);
      Mixpanel.setEvent('trying loading more - loading more', { distanceFromEnd });
      const canLoadMore = await loadMoreRides();
      await setShowBottomLoader(false);
      if (!canLoadMore) {
        Mixpanel.setEvent('trying loading more - stop loading more', { distanceFromEnd });
        await setStopLoading(true);
      }
    }
  };

  return (
    <RidesViewContainer>
      <FlatList
        data={rides}
        onEndReached={info => startLoadMoreRides(info)}
        onEndReachedThreshold={0.5}
        keyExtractor={ride => `ride#${ride.id}$${rides.indexOf(ride)}`}
        renderItem={({ item: ride, index }) => (
          <RideCardInList
            showBottomLoader={showBottomLoader}
            ride={ride}
            index={index}
            lastItem={rides.indexOf(ride) + 1 === rides.length}
            showSpacer={index + 1 !== rides.length}
          />
        )}
        ListFooterComponent={() => (
          <View style={{ height: 100 }} />
        )}
      />
    </RidesViewContainer>
  );
};

const RidesList = React.memo(({
  rides,
  activeFilter,
}) => (
  <>
    {rides && rides.length ? (
      <RidesView rides={rides} />
    ) : (
      <NoRidesInList yet={FILTERS.today.id === activeFilter} />
    )}
  </>
));

export default RidesList;

RidesList.propTypes = {};

RidesList.defaultProps = {};
