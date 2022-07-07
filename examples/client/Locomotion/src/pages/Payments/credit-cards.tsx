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
import {
  Arrow, ArrowContainer, CardContainer, CardContantContainer, CardText, CardTitle, CardTitleContainer, VerifyContainer, VerifyText,
} from '../../Components/InformationCard/styled';

import PaymentMethod from '../../Components/CardRow';
import PaymentsContext from '../../context/payments';
import cashPaymentMethod from './cashPaymentMethod';
import { navigate } from '../../services/navigation';

export default ({
  onDetach = (id: string) => null,
  loadingState = false,
  onAddClick = undefined,
}) => {
  const [loading, setLoading] = useState(false);
  const [defaultMethod, setDefaultMethod] = useState(null);
  const usePayments = PaymentsContext.useContainer();

  useEffect(() => {
    setLoading(true);
    const defaultPaymentMethod = usePayments.paymentMethods.find(({ isDefault }) => isDefault) || usePayments.paymentMethods[0];
    setDefaultMethod(defaultPaymentMethod);
    setLoading(false);
  }, [usePayments]);

  useEffect(() => {
    setLoading(loadingState);
  }, [loading]);


  return (
    <CardsListContainer>
      <View>
        <PaymentMethodsContainer>
          <CardContainer>
            <CardContantContainer>
              <CardTitleContainer>
                <CardTitle>Default payment method</CardTitle>
              </CardTitleContainer>
              <PaymentMethod {...defaultMethod} onPress={() => navigate(MAIN_ROUTES.CARD_DETAILS, { paymentMethod: defaultMethod })} />
            </CardContantContainer>
          </CardContainer>

          {usePayments.paymentMethods.length > 1
            ? (
              <CardContainer>
                <CardContantContainer>
                  <CardTitleContainer>
                    <CardTitle>other payment method</CardTitle>
                  </CardTitleContainer>
                  {usePayments.paymentMethods.map(paymentMethod => (paymentMethod.id !== defaultMethod.id
                    ? <PaymentMethod {...paymentMethod} onPress={() => navigate(MAIN_ROUTES.CARD_DETAILS, { paymentMethod })} />
                    : undefined))}
                </CardContantContainer>
              </CardContainer>
            )
            : undefined}

        </PaymentMethodsContainer>

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
