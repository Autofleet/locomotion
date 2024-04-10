import React, {
  useCallback, useContext,
} from 'react';
import { Text, View } from 'react-native';
import { PaymentIcon } from 'react-native-payment-icons';
import styled, { ThemeContext } from 'styled-components';
import { useFocusEffect } from '@react-navigation/native';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { isCardPaymentMethod, isCashPaymentMethod, isOfflinePaymentMethod } from '../../../../../../lib/ride/utils';
import { getCouponText } from '../../../../../../context/newRideContext/utils';
import { MAIN_ROUTES } from '../../../../../routes';
import SvgIcon from '../../../../../../Components/SvgIcon';
import { FONT_SIZES, FONT_WEIGHTS, GREEN_COLOR } from '../../../../../../context/theme';
import { Brand } from '../../../../../../context/payments/interface';
import plus from '../../../../../../assets/bottomSheet/plus.svg';
import i18n from '../../../../../../I18n';
import Button from '../../../../../../Components/Button';
import * as navigationService from '../../../../../../services/navigation';
import { UserContext } from '../../../../../../context/user';
import selected from '../../../../../../assets/selected-v.svg';

const TimeText = styled(Text)`
    ${FONT_SIZES.LARGE}
    ${FONT_WEIGHTS.MEDIUM}
    color: #333;
    margin: 5px;

    max-width: 80%;
`;

const Container = styled(View)`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    width: 100%;
`;

const CardNameContainer = styled(View)`
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
    width: ${({ fullWidth }) => (fullWidth ? '100%' : '55%')};
`;

const PromoButtonContainer = styled(View)`
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    align-items: center;
    flex: 1;
`;

const PromoCodeTextContainer = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

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
interface PaymentButtonProps {
    icon: string;
    title: string;
    brand?: Brand;
    id?: string;
    invalid?: boolean;
}


const PaymentButton = ({
  icon,
  title,
  brand,
  id,
  invalid,
}: PaymentButtonProps) => {
  const { primaryColor } = useContext(ThemeContext);
  const { getCoupon, coupon, setCoupon } = useContext(UserContext);
  const isDebuggingEnabled = (typeof atob !== 'undefined');
  const noCoupon = coupon && coupon.status === 'error';

  const loadPromoText = () => (coupon && !noCoupon ? i18n.t('home.promoCode.amountOff', { amount: getCouponText(coupon) })
    : i18n.t('bottomSheetContent.ride.promoText'));

  const loadPromoButton = () => {
    if (isCashPaymentMethod({ id }) || isOfflinePaymentMethod({ id })) {
      return null;
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
            <PromoText
              numberOfLines={1}
              testID="usePromoCode"
            >
              {loadPromoText()}
            </PromoText>
          </PromoCodeTextContainer>
        </PromoButton>
      );
    }
    return (null);
  };

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
  const IconColor = invalid ? '#F83743' : primaryColor;
  return (
    <Container>
      <CardNameContainer fullWidth={!isCardPaymentMethod({ id })}>
        {isCardPaymentMethod({ id }) ? <PaymentIcon type={brand || 'generic'} />
          : (
            <SvgIcon
              fill={IconColor}
              Svg={icon}
              height={25}
              width={40}
            />
          )}
        <TimeText numberOfLines={1}>{title}</TimeText>
      </CardNameContainer>
      <PromoButtonContainer>
        {loadPromoButton()}
      </PromoButtonContainer>
    </Container>
  );
};

export default PaymentButton;

PaymentButton.defaultProps = {
  brand: null,
  id: null,
  invalid: false,
};
