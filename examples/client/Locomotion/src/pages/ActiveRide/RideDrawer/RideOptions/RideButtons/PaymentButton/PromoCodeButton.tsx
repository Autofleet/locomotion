import React, { useCallback, useContext } from 'react';
import { Text } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { useFocusEffect } from '@react-navigation/native';
import {
  isCashPaymentMethod,
  isExternalPaymentMethod,
  isOfflinePaymentMethod,
} from '../../../../../../lib/ride/utils';
import { getCouponText } from '../../../../../../context/newRideContext/utils';
import { MAIN_ROUTES } from '../../../../../routes';
import SvgIcon from '../../../../../../Components/SvgIcon';
import { FONT_SIZES, FONT_WEIGHTS, GREEN_COLOR } from '../../../../../../context/theme';
import plus from '../../../../../../assets/bottomSheet/plus.svg';
import i18n from '../../../../../../I18n';
import Button from '../../../../../../Components/Button';
import * as navigationService from '../../../../../../services/navigation';
import { UserContext } from '../../../../../../context/user';
import selected from '../../../../../../assets/selected-v.svg';
import { PromoButtonSkeleton } from './Skeleton/PromoButtonSkeleton';

const PromoButton = styled(Button)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const PromoText = styled(Text)`
  ${FONT_SIZES.LARGE}
  ${FONT_WEIGHTS.MEDIUM}
  color: #333;
  margin: 10px 5px;
`;

interface PromoCodeButtonProps {
  id?: string;
}

const PromoCodeButton = ({ id }: PromoCodeButtonProps) => {
  const { primaryColor } = useTheme();
  const { getCoupon, coupon, setCoupon } = useContext(UserContext);
  const isDebuggingEnabled = typeof atob !== 'undefined';
  const noCoupon = coupon && coupon.status === 'error';

  const checkCoupon = async () => {
    try {
      const res = await getCoupon();
      setCoupon(res);
    } catch (e) {
      setCoupon({ status: 'error' });
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkCoupon();
      return () => setCoupon(null);
    }, []),
  );

  if (isCashPaymentMethod({ id }) || isOfflinePaymentMethod({ id }) || isExternalPaymentMethod({ id })) {
    return null;
  }

  if (!isDebuggingEnabled && coupon === null) {
    return <PromoButtonSkeleton />;
  }

  if (coupon === null) {
    return null;
  }

  const promoText = coupon && !noCoupon
    ? i18n.t('home.promoCode.amountOff', { amount: getCouponText(coupon) })
    : i18n.t('bottomSheetContent.ride.promoText');

  return (
    <PromoButton
      noBackground
      activeOpacity={!noCoupon && 1}
      onPress={() => noCoupon && navigationService.navigate(MAIN_ROUTES.PROMO_CODE, { rideFlow: true })}
    >
      <SvgIcon
        stroke={noCoupon ? primaryColor : GREEN_COLOR}
        fill={noCoupon ? primaryColor : GREEN_COLOR}
        Svg={noCoupon ? plus : selected}
        height={15}
        width={15}
      />
      <PromoText numberOfLines={1} testID="usePromoCode">
        {promoText}
      </PromoText>
    </PromoButton>
  );
};

export default PromoCodeButton;
