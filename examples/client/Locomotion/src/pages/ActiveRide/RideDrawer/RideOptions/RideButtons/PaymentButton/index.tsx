import React from 'react';
import { Text } from 'react-native';
import { PaymentIcon } from 'react-native-payment-icons';
import styled from 'styled-components';
import cashPaymentMethod from '../../../../../../pages/Payments/cashPaymentMethod';
import SvgIcon from '../../../../../../Components/SvgIcon';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../../context/theme';
import { Brand } from '../../../../../../context/payments/interface';
import cashIcon from '../../../../../../assets/cash.svg';

const TimeText = styled(Text)`
    ${FONT_SIZES.LARGE}
    ${FONT_WEIGHTS.MEDIUM}
    color: #333;
    margin: 5px;
`;
interface PaymentButtonProps {
    icon: string;
    title: string;
    brand?: Brand | undefined;
    id?: string;
}


const PaymentButton = ({
  icon,
  title,
  brand,
  id,
}: PaymentButtonProps) => (
  <>
    {id ? (id !== cashPaymentMethod.id
      ? <PaymentIcon type={brand} />
      : <SvgIcon Svg={cashIcon} height={15} width={15} />)
      : <SvgIcon Svg={icon} height={15} width={15} />}
    <TimeText>{title}</TimeText>
  </>
);

export default PaymentButton;

PaymentButton.defaultProps = {
  brand: null,
  id: null,
};
