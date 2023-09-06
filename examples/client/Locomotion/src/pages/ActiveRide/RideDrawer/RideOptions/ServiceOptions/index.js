import React, { useContext, useEffect, useState } from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { Text } from 'react-native';
import { getFormattedPrice } from '../../../../../context/newRideContext/utils';
import { RidePageContext } from '../../../../../context/newRideContext';
import { UserContext } from '../../../../../context/user';
import ServiceCard from './ServiceCard';
import { ServiceOptionsContainer } from './styles';
import { serviceCardSkeleton } from './ServiceCard/skeleton';
import { BottomSheetContext } from '../../../../../context/bottomSheetContext';
import i18n from '../../../../../I18n';

const ServiceOptions = () => {
  const { serviceEstimations, stopRequestInterval } = useContext(RidePageContext);
  const { getCoupon } = useContext(UserContext);
  const isDebuggingEnabled = (typeof atob !== 'undefined');
  const { setTopBarText, setBackgroundColor, setTopBarTextTags } = useContext(BottomSheetContext);
  const [coupon, setCoupon] = useState(null);

  const fetchCoupon = async () => {
    const result = await getCoupon();
    setCoupon(result);
  };

  useEffect(() => {
    fetchCoupon();
    return () => stopRequestInterval();
  }, []);

  useEffect(() => {
    if (coupon) {
      const couponDiscount = coupon.percent_off ? `${coupon.percent_off}%`
        : getFormattedPrice(coupon.currency, coupon.amount_off);
      setTopBarText(i18n.t('rideDetails.couponDiscountMessage', { couponDiscount }));
      setBackgroundColor('#25B861');
      setTopBarTextTags([<Text style={{ fontWeight: 'bold' }} />]);
    } else if ((serviceEstimations || []).some(estimation => estimation.isPriceEstimated)) {
      setTopBarText(i18n.t('rideDetails.estimatedFareMessage'));
    }

    return () => {
      setTopBarText('');
      setBackgroundColor(null);
      setTopBarTextTags([]);
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
