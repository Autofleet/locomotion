import React, { useContext } from 'react';
import { Text } from 'react-native';
import { PaymentIcon } from 'react-native-payment-icons';
import styled, { ThemeContext } from 'styled-components';
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
  return (
    <>
      {id ? (id !== cashPaymentMethod.id
        ? <PaymentIcon type={brand || 'generic'} />
        : <SvgIcon fill={primaryColor} Svg={cashIcon} height={15} width={15} />)
        : <SvgIcon fill={primaryColor} Svg={icon} height={15} width={15} />}
      <TimeText>{title}</TimeText>
    </>
  );
};

export default PaymentButton;

PaymentButton.defaultProps = {
  brand: null,
  id: null,
};
