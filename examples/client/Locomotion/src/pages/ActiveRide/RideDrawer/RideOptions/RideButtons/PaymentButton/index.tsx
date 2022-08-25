import React, { useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { PaymentIcon } from 'react-native-payment-icons';
import styled, { ThemeContext } from 'styled-components';
import { MAIN_ROUTES } from '../../../../../routes';
import cashPaymentMethod from '../../../../../../pages/Payments/cashPaymentMethod';
import SvgIcon from '../../../../../../Components/SvgIcon';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../../context/theme';
import { Brand } from '../../../../../../context/payments/interface';
import cashIcon from '../../../../../../assets/cash.svg';
import plus from '../../../../../../assets/bottomSheet/plus.svg';
import i18n from '../../../../../../I18n';
import Button from '../../../../../../Components/Button';
import * as navigationService from '../../../../../../services/navigation';
import { UserContext } from '../../../../../../context/user';

const TimeText = styled(Text)`
    ${FONT_SIZES.LARGE}
    ${FONT_WEIGHTS.MEDIUM}
    color: #333;
    margin: 5px;
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
`;

const PromoButton = styled(Button)`
display: flex;
flex-direction: row;
align-items: center;
`;

const PromoText = styled(Text)`
    ${FONT_SIZES.SMALL}
    ${FONT_WEIGHTS.MEDIUM}
    color: ${({ theme }) => theme.primaryColor};
    margin: 10px 5px;
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
  const [coupon, setCoupon] = useState(null);
  const { getCoupon } = useContext(UserContext);

  const checkCoupon = async () => {
    try {
      const res = await getCoupon();
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    checkCoupon();
  }, []);

  const promoText = i18n.t('bottomSheetContent.ride.promoText');
  return (
    <Container>
      <CardNameContainer>
        {id ? (id !== cashPaymentMethod.id
          ? <PaymentIcon type={brand || 'generic'} />
          : <SvgIcon fill={primaryColor} Svg={cashIcon} height={25} width={40} />)
          : <SvgIcon fill={primaryColor} Svg={icon} height={15} width={15} />}
        <TimeText>{title}</TimeText>
      </CardNameContainer>
      <PromoButton
        noBackground
        onPress={() => navigationService.navigate(MAIN_ROUTES.PROMO_CODE, { rideFlow: true })}
      >
        <SvgIcon stroke={primaryColor} fill={primaryColor} Svg={plus} height={10} width={10} />
        <PromoText>
          {promoText}
        </PromoText>
      </PromoButton>
    </Container>
  );
};

export default PaymentButton;

PaymentButton.defaultProps = {
  brand: null,
  id: null,
};
