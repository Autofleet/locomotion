import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View } from 'react-native';
import GenericErrorPopup from '../../popups/GenericError';
import { FILTERS } from './filters';
import { HeaderIconContainer } from '../../Components/PageHeader/styled';
import { CenterContainer } from './RideCard/styled';
import RidesList from './RidesList';
import Loader from '../../Components/Loader';
import FilterBar from './FilterBar';
import { MAIN_ROUTES } from '../routes';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import {
  CalendarSvgIcon,
  PageContent,
} from './styled';
import Mixpanel from '../../services/Mixpanel';
import { rideHistoryContext } from '../../context/rideHistory';
import { PageContainer } from '../styles';
import {
  DD_MMMM_YYYY, endOfDayTime, startOfDayTime, YYYY_MM_DD,
} from './consts';
import RangeDateTimePicker from './RangeDateTimePicker';

const getCustomFilter = filterId => ({
  [filterId]: {
    id: filterId,
    title: filterId,
    isCustomFilter: true,
  },
});

const Page = ({ menuSide }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    rides, loadRides, initRides, savedParams,
  } = useContext(rideHistoryContext);
  const [filter, setFilter] = useState(savedParams ? savedParams.filterId : FILTERS.today.id);
  const [customFilter, setCustomFilter] = useState(savedParams && !FILTERS[savedParams.filterId]
    ? getCustomFilter(savedParams.filterId) : {});
  const [showLoader, setLoader] = useState(!rides);
  const [showRangeDateTimePicker, setShowRangeDateTimePicker] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const getRidesWithErrorHandler = async (rideLoaderFunction) => {
    try {
      await rideLoaderFunction();
    } catch (e) {
      setShowErrorPopup(true);
    }
  };

  const onPageLoaded = async () => {
    const { today } = FILTERS;
    await getRidesWithErrorHandler(async () => initRides({
      initFilterId: today.id,
      ...(today.getParams()),
    }));
    setLoader(false);
  };

  useEffect(() => {
    Mixpanel.pageView(route.name);
    onPageLoaded();
  }, []);

  const onFilterClicked = async (filterId) => {
    setCustomFilter({});
    setLoader(true);
    const filterClicked = FILTERS[filterId];
    setFilter(filterId);
    await getRidesWithErrorHandler(async () => loadRides({
      filterId: filterClicked.id,
      ...(filterClicked.getParams()),
    }));
    setLoader(false);
  };

  const onCustomFilterClicked = async (newFromDate, newToDate) => {
    setShowRangeDateTimePicker(false);
    setLoader(true);

    const momentNewFromDate = moment(newFromDate);
    const momentNewToDate = moment(newToDate);

    const filterId = `${momentNewFromDate.format(DD_MMMM_YYYY)} to ${momentNewToDate.format(DD_MMMM_YYYY)}`;
    setFilter(filterId);
    setCustomFilter(getCustomFilter(filterId));
    await getRidesWithErrorHandler(async () => loadRides({
      filterId,
      fromDate: `${momentNewFromDate.format(YYYY_MM_DD)} ${startOfDayTime}`,
      toDate: `${momentNewToDate.format(YYYY_MM_DD)} ${endOfDayTime}`,
    }));
    setLoader(false);
  };

  return (
    <PageContainer>
      <PageContent>
        {showRangeDateTimePicker && (
          <RangeDateTimePicker
            onCancel={() => setShowRangeDateTimePicker(false)}
            onConfirm={onCustomFilterClicked}
          />
        )}
        <PageHeader
          title={i18n.t('rideHistory.pageTitle')}
          onIconPress={() => navigation.navigate(MAIN_ROUTES.HOME)}
          iconSide={menuSide}
          action={(
            <HeaderIconContainer
              onPress={() => setShowRangeDateTimePicker(true)}
              data-test-id="calendarIcon"
            >
              <CalendarSvgIcon />
            </HeaderIconContainer>
          )}
        />
        <View>
          <FilterBar
            onFilterClicked={onFilterClicked}
            activeFilter={filter}
            filters={{
              ...customFilter,
              ...FILTERS,
            }}
          />
        </View>
        {showLoader ? (
          <CenterContainer addTop>
            <Loader
              dark
              lottieViewStyle={{
                height: 15, width: 15,
              }}
            />
          </CenterContainer>
        ) : (
          <RidesList activeFilter={filter} rides={rides} />
        )}
      </PageContent>
      <GenericErrorPopup
        isVisible={showErrorPopup}
        closePopup={() => {
          navigation.navigate(MAIN_ROUTES.HOME);
        }}
      />
    </PageContainer>
  );
};

export default Page;
