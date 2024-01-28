import React, { useContext, useEffect } from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { Text } from 'react-native';
import EmptyState from '../../../../../Components/EmptyState';
import { getCouponText } from '../../../../../context/newRideContext/utils';
import { RidePageContext } from '../../../../../context/newRideContext';
import { UserContext } from '../../../../../context/user';
import SettingsContext from '../../../../../context/settings';
import ServiceCard from './ServiceCard';
import { ServiceOptionsContainer } from './styles';
import { serviceCardSkeleton } from './ServiceCard/skeleton';
import { BottomSheetContext, INITIAL_TOP_BAR_PROPS } from '../../../../../context/bottomSheetContext';
import i18n from '../../../../../I18n';

const SUCCESS_COLOR = '#25B861';

const ServiceOptions = () => {
  const { serviceEstimations, stopRequestInterval } = useContext(RidePageContext);
  const { showPrice, loadShowPrice } = SettingsContext.useContainer();

  const { coupon } = useContext(UserContext);
  const isDebuggingEnabled = (typeof atob !== 'undefined');
  const { setTopBarProps } = useContext(BottomSheetContext);

  useEffect(() => () => stopRequestInterval(), []);
  useEffect(() => {
    loadShowPrice();
  }, []);

  const clearTopBar = () => {
    setTopBarProps(INITIAL_TOP_BAR_PROPS);
  };

  const setCouponTopBar = () => {
    setTopBarProps({
      text: i18n.t('rideDetails.couponDiscountMessage', { couponDiscount: getCouponText(coupon) }),
      backgroundColor: SUCCESS_COLOR,
      htmlTags: [<Text style={{ fontWeight: 'bold' }} />],
    });
  };

  const setEstimateFareTopBar = () => {
    setTopBarProps({
      text: i18n.t('rideDetails.estimatedFareMessage'),
      backgroundColor: null,
      htmlTags: [],
    });
  };

  useEffect(() => {
    if (coupon && coupon.status !== 'error') {
      setCouponTopBar();
    } else if (showPrice
      && (serviceEstimations || []).some(estimation => estimation.isPriceEstimated)) {
      setEstimateFareTopBar();
    }

    return () => {
      clearTopBar();
    };
  }, [serviceEstimations, coupon]);


  return (
    <ServiceOptionsContainer alwaysBounceVertical={false}>

      { serviceEstimations?.length === 0
        ? (
          <EmptyState
            title={i18n.t('services.emptyState.title')}
            description={i18n.t('services.emptyState.description')}
          />
        )
        : (serviceEstimations || []).map(option => (
          <ServiceCard
            withBorder
            service={option}
            key={option.name}
          />
        ))
      }
      {!isDebuggingEnabled
        ? (
          <SkeletonContent
            containerStyle={{}}
            isLoading={!serviceEstimations}
            layout={[
              serviceCardSkeleton,
              serviceCardSkeleton,
              serviceCardSkeleton,
            ]}
          />
        ) : null}
    </ServiceOptionsContainer>
  );
};

export default ServiceOptions;
