import React from 'react';
import i18n from '../../../I18n';
import PaymentContext from '../../../context/payments';
import { BodyText, Container } from './styled';
import { PaymentMethodInterface } from '../../../context/payments/interface';

const TopMessage = () => {
  const {
    getClientOutstandingBalanceCard,
  }: {
    getClientOutstandingBalanceCard: () => PaymentMethodInterface | undefined;
  } = PaymentContext.useContainer();

  const creditCard = {
    name: 'mastercard 4444',
  };

  return (
    creditCard
      ? (
        <Container>
          <BodyText>
            {i18n.t('activeRide.topMessage.outstandBalanceCreditCard', {
              name: creditCard?.name,
            }).toString()}
          </BodyText>
        </Container>
      )
      : null
  );
};

export default TopMessage;
