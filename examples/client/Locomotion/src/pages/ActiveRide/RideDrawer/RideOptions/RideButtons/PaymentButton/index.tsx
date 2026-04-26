import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { PaymentIcon } from 'react-native-payment-icons';
import styled, { ThemeContext } from 'styled-components';
import { isCardPaymentMethod } from '../../../../../../lib/ride/utils';
import SvgIcon from '../../../../../../Components/SvgIcon';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../../context/theme';
import { Brand } from '../../../../../../context/payments/interface';

const TimeText = styled(Text)`
    ${FONT_SIZES.LARGE}
    ${FONT_WEIGHTS.MEDIUM}
    color: #333;
    margin: 5px;
`;

const Container = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
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
  const IconColor = invalid ? '#F83743' : primaryColor;
  return (
    <Container>
      {isCardPaymentMethod({ id }) ? (
        <PaymentIcon type={brand || 'generic'} />
      ) : (
        <SvgIcon
          fill={IconColor}
          Svg={icon}
          height={25}
          width={40}
        />
      )}
      <TimeText numberOfLines={1}>{title}</TimeText>
    </Container>
  );
};

export default PaymentButton;

PaymentButton.defaultProps = {
  brand: null,
  id: null,
  invalid: false,
};
