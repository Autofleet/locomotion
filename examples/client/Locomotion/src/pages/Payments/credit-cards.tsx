import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
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
}) => {
  const [loading, setLoading] = useState(false);
  const usePayments = PaymentsContext.useContainer();

  useEffect(() => {
    setLoading(loadingState);
  }, [loading]);

  return (
    <CardsListContainer>
      <View>
        {(usePayments.isCashEnabled ? [...usePayments.paymentMethods, cashPaymentMethod] : usePayments.paymentMethods).map((paymentMethod : any, i) => (
          <PaymentMethodsContainer>
            <CreditCardsContainer>
              <PaymentMethod {...paymentMethod} />
            </CreditCardsContainer>
            {paymentMethod.id !== cashPaymentMethod.id
            && (
            <View>
              <DeleteCreditCard disabled={loading}>
                <DeleteCreditCardText onPress={() => onDetach(paymentMethod.id)}>
                  {i18n.t('payments.deleteCard')}
                </DeleteCreditCardText>
              </DeleteCreditCard>
            </View>
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
