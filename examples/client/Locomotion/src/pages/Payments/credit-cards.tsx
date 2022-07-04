import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Promise } from 'bluebird';
import i18n from '../../I18n';
import {
  DeleteCreditCard,
  DeleteCreditCardText,
  CardsListContainer,
  PaymentMethodsContainer,
  CreditCardsContainer,
} from './styled';

import PaymentMethod from '../../Components/CardRow';
import PaymentsContext from '../../context/payments';
import cashPaymentMethod from './cashPaymentMethod';

export default ({
  onDetach = (id: string) => null,
  loadingState = false,
  onAddClick = undefined,
  isCashEnabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const usePayments = PaymentsContext.useContainer();

  useEffect(() => {
    setLoading(loadingState);
  }, [loading]);


  return (
    <CardsListContainer>
      <View>
        {(isCashEnabled ? [...usePayments.paymentMethods, cashPaymentMethod] : usePayments.paymentMethods).map((paymentMethod : any) => (
          <PaymentMethodsContainer>
            <CreditCardsContainer>
              <PaymentMethod {...paymentMethod} />
            </CreditCardsContainer>
            {paymentMethod.id !== cashPaymentMethod.id
            && (
              <DeleteCreditCard disabled={loading}>
                <DeleteCreditCardText onPress={() => onDetach(paymentMethod.id)}>
                  {i18n.t('payments.deleteCard')}
                </DeleteCreditCardText>
              </DeleteCreditCard>
            )}
          </PaymentMethodsContainer>
        ))}

      </View>
      {onAddClick ? (
        <PaymentMethod
          addNew
          onPress={onAddClick}
        />
      ) : undefined}
    </CardsListContainer>
  );
};
