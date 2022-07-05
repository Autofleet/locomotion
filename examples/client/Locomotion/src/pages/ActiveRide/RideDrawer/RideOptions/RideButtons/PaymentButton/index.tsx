import React from 'react';
import { Text } from 'react-native';
import { PaymentIcon } from 'react-native-payment-icons';
import styled from 'styled-components';
import SvgIcon from '../../../../../../Components/SvgIcon';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../../context/theme';
import { Brand } from '../../../../../../context/payments/interface';

const TimeText = styled(Text)`
    ${FONT_SIZES.LARGE}
    ${FONT_WEIGHTS.MEDIUM}
    color: #333;
    margin: 5px;
`;
interface PaymentButtonProps {
    icon: string;
    title: string;
    brand?: Brand;
}


const PaymentButton = ({
  icon,
  title,
  brand,
}: PaymentButtonProps) => (
  <>
    {brand
      ? <PaymentIcon type={brand} />
      : <SvgIcon fill="#38a7fc" Svg={icon} height={15} width={15} />}
    <TimeText>{title}</TimeText>
  </>
);

export default PaymentButton;

PaymentButton.defaultProps = {
  brand: null,
};
