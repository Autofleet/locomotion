import moment from 'moment';
import React, { useEffect, useState } from 'react';

import i18n from '../../I18n';
import {
  CreditCardRow,
  CreditCardImage,
  CreditCardRowText,
  CreditCardContainer,
  DeleteCreditCard,
  DeleteCreditCardText,
  CardsListContainer,
} from './styled';

export default ({
  paymentMethods = [],
  onDetach = () => null,
  loadingState = false,
  onAddClick = undefined,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(loadingState);
  }, [loading]);

  return (
    <CardsListContainer>
      {paymentMethods.map(pm => (
        <CreditCardContainer key={`paymentMethods#${pm.id}`}>
          <CreditCardRow>
            <CreditCardImage />
            <CreditCardRowText>{pm.brand}</CreditCardRowText>
            <CreditCardRowText>
              {moment(pm.expiresAt).format('MM/YY')}
            </CreditCardRowText>
            <CreditCardRowText>{pm.lastFour}</CreditCardRowText>
          </CreditCardRow>
          <DeleteCreditCard disabled={loading}>
            <DeleteCreditCardText
              onPress={() => onDetach(pm.id)}
            >
              {i18n.t('payments.deleteCard')}
            </DeleteCreditCardText>
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
