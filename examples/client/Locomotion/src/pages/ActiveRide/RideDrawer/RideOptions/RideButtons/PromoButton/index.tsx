
import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import styled, { ThemeContext } from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS, GREEN_COLOR } from '../../../../../../context/theme';
import { PAYMENT_METHODS } from '../../../../../../pages/Payments/consts';
import { getFormattedPrice } from '../../../../../../context/newRideContext/utils';
import i18n from '../../../../../../I18n';
import { MAIN_ROUTES } from '../../../../../routes';
import Button from '../../../../../../Components/Button';
import SvgIcon from '../../../../../../Components/SvgIcon';
import plus from '../../../../../../assets/bottomSheet/plus.svg';
import * as navigationService from '../../../../../../services/navigation';
import selected from '../../../../../../assets/selected-v.svg';

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

const PromoCodeTextContainer = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

interface PromoButtonComponentInterface {
  paymentMethodId: string;
  coupon: any;
}

const PromoButtonComponent = ({ paymentMethodId, coupon }: PromoButtonComponentInterface) => {
  const { primaryColor } = useContext(ThemeContext);
  const isDebuggingEnabled = (typeof atob !== 'undefined');
  const noCoupon = coupon && coupon.status === 'error';

  const loadPromoText = () => {
    if (coupon && !noCoupon) {
      let amount;
      if (coupon.amount_off) {
        amount = getFormattedPrice(coupon.currency, coupon.amount_off);
      } else if (coupon.percent_off) {
        amount = `${coupon.percent_off}%`;
      }

      return i18n.t('home.promoCode.amountOff', { amount });
    }
    return i18n.t('bottomSheetContent.ride.promoText');
  };

  if (paymentMethodId === PAYMENT_METHODS.CASH) {
    return <></>;
  }
  if (!isDebuggingEnabled && coupon === null) {
    return (
      <SkeletonContent
        containerStyle={{}}
        isLoading
        layout={[
          { width: 40, height: 10, marginTop: 10 },
        ]}
      />
    );
  }
  if (coupon !== null) {
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
        <PromoCodeTextContainer>
          <PromoText numberOfLines={1}>
            {loadPromoText()}
          </PromoText>
        </PromoCodeTextContainer>
      </PromoButton>
    );
  }
  return <></>;
};

export default PromoButtonComponent;
