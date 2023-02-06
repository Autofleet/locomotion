import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import { Text, View } from 'react-native';
import { PaymentIcon } from 'react-native-payment-icons';
import styled, { ThemeContext } from 'styled-components';
import { useFocusEffect } from '@react-navigation/native';
import SvgIcon from '../../../../../../Components/SvgIcon';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../../context/theme';
import { Brand } from '../../../../../../context/payments/interface';
import cashIcon from '../../../../../../assets/cash.svg';
import { UserContext } from '../../../../../../context/user';
import { PAYMENT_METHODS } from '../../../../../../pages/Payments/consts';
import PromoButtonComponent from '../PromoButton';

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
    width: 55%;
`;

const PromoButtonContainer = styled(View)`
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    align-items: center;
    flex: 1;
`;

interface PaymentButtonProps {
    icon: string;
    title: string;
    brand?: Brand;
    id?: string;
}


const PaymentButton = ({
  icon,
  title,
  brand,
  id,
}: PaymentButtonProps) => {
  const { primaryColor } = useContext(ThemeContext);
  const [coupon, setCoupon] = useState<any>(null);
  const { getCoupon } = useContext(UserContext);

  useEffect(() => {
    if (coupon) {
      setCoupon(null);
    }
  }, []);

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
    }, []),
  );

  return (
    <Container>
      <CardNameContainer>
        {id ? (id !== PAYMENT_METHODS.CASH
          ? <PaymentIcon type={brand || 'generic'} />
          : <SvgIcon fill={primaryColor} Svg={cashIcon} height={25} width={40} />)
          : <SvgIcon fill={primaryColor} Svg={icon} height={15} width={15} />}
        <TimeText numberOfLines={1}>{title}</TimeText>
      </CardNameContainer>
      <PromoButtonContainer>
        {id
        && (
        <PromoButtonComponent
          paymentMethodId={id}
          coupon={coupon}
        />
        )}
      </PromoButtonContainer>
    </Container>
  );
};

export default PaymentButton;

PaymentButton.defaultProps = {
  brand: null,
  id: null,
};
