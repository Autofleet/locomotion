import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { MAIN_ROUTES } from '../routes';
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
import { navigate } from '../../services/navigation';

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
              <PaymentMethod {...paymentMethod} onPress={() => navigate(MAIN_ROUTES.CARD_DETAILS, { paymentMethod, onDetach })} />
            </CreditCardsContainer>
          </PaymentMethodsContainer>
        ))}
        {onAddClick ? (
          <PaymentMethod
            addNew
            onPress={onAddClick}
          />
        ) : undefined}
      </View>

    </CardsListContainer>
  );
};
