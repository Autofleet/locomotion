import React, {useEffect, useState} from 'react';

import i18n from '../../I18n';
import {
  CreditCardRow,
  CreditCardImage,
  CreditCardRowText,
  CreditCardContainer,
  DeleteCreditCard,
  DeleteCreditCardText,
  CardsListContainer
} from './styled';

export default ({
  paymentMethods = [],
  onDetach = () => null,
  loadingState = false,
  onAddClick = undefined,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(loadingState)
  }, [loading])

  return (
    <CardsListContainer>
      {paymentMethods.map(pm => (
          <CreditCardContainer key={`paymentMethods#${pm.card.last4}`}>
            <CreditCardRow>
              <CreditCardImage/>
              <CreditCardRowText>{pm.card.brand}</CreditCardRowText>
              <CreditCardRowText>{pm.card.exp_month}/{pm.card.exp_year}</CreditCardRowText>
              <CreditCardRowText>{pm.card.last4}</CreditCardRowText>
            </CreditCardRow>
            <DeleteCreditCard disabled={loading}>
              <DeleteCreditCardText
                onPress={() => onDetach(pm.id)}>{i18n.t('payments.deleteCard')}</DeleteCreditCardText>
            </DeleteCreditCard>
          </CreditCardContainer>
        ))}
      {onAddClick ? (
        <CreditCardContainer onPress={onAddClick}>
          <CreditCardRowText>add new</CreditCardRowText>
        </CreditCardContainer>
      ) : undefined}
    </CardsListContainer>
  );
};
