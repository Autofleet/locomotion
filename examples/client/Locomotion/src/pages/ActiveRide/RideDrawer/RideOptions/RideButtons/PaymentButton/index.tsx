import React from 'react';
import { Text, View } from 'react-native';
import { PaymentIcon } from 'react-native-payment-icons';
import styled, { useTheme } from 'styled-components/native';
import { isCardPaymentMethod } from '../../../../../../lib/ride/utils';
import SvgIcon from '../../../../../../Components/SvgIcon';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../../context/theme';
import { Brand } from '../../../../../../context/payments/interface';

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

const CardNameContainer = styled(View)<{ fullWidth?: boolean }>`
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

interface PaymentButtonProps {
  icon: string;
  title: string | null;
  brand?: Brand | null;
  id?: string | null;
  invalid?: boolean;
  promoButton?: React.ReactNode;
}

const PaymentButton = ({
  icon,
  title,
  brand = null,
  id = null,
  invalid = false,
  promoButton = null,
}: PaymentButtonProps) => {
  const { primaryColor } = useTheme();
  const IconColor = invalid ? '#F83743' : primaryColor;
  return (
    <Container>
      <CardNameContainer fullWidth={!promoButton}>
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
      </CardNameContainer>
      {promoButton && (
        <PromoButtonContainer>
          {promoButton}
        </PromoButtonContainer>
      )}
    </Container>
  );
};

export default PaymentButton;
