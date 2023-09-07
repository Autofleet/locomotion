import React, { useContext, useEffect } from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { Text } from 'react-native';
import { getCouponText } from '../../../../../context/newRideContext/utils';
import { RidePageContext } from '../../../../../context/newRideContext';
import { UserContext } from '../../../../../context/user';
import ServiceCard from './ServiceCard';
import { ServiceOptionsContainer } from './styles';
import { serviceCardSkeleton } from './ServiceCard/skeleton';
import { BottomSheetContext } from '../../../../../context/bottomSheetContext';
import i18n from '../../../../../I18n';

const SUCCESS_COLOR = '#25B861';

const ServiceOptions = () => {
  const { serviceEstimations, stopRequestInterval } = useContext(RidePageContext);
  const { coupon } = useContext(UserContext);
  const isDebuggingEnabled = (typeof atob !== 'undefined');
  const { setTopBarText, setBackgroundColor, setTopBarTextTags } = useContext(BottomSheetContext);

  useEffect(() => () => stopRequestInterval(), []);

  const clearTopBar = () => {
    setTopBarText('');
    setBackgroundColor(null);
    setTopBarTextTags([]);
  };

  const setCouponTopBar = () => {
    setTopBarText(i18n.t('rideDetails.couponDiscountMessage', { couponDiscount: getCouponText(coupon) }));
    setBackgroundColor(SUCCESS_COLOR);
    setTopBarTextTags([<Text style={{ fontWeight: 'bold' }} />]);
  };

  const setEstimateFareTopBar = () => {
    setTopBarText(i18n.t('rideDetails.estimatedFareMessage'));
    setBackgroundColor(null);
    setTopBarTextTags([]);
  };

  useEffect(() => {
    if (coupon && coupon.status !== 'error') {
      setCouponTopBar();
    } else if ((serviceEstimations || []).some(estimation => estimation.isPriceEstimated)) {
      setEstimateFareTopBar();
    }

    return () => {
      clearTopBar();
    };
  }, [serviceEstimations, coupon]);


  return (
    <ServiceOptionsContainer alwaysBounceVertical={false}>
      {(serviceEstimations || []).map(option => (
        <ServiceCard
          withBorder
          service={option}
          key={option.name}
        />
      ))}
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
