import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import { PaymentMethodInterface } from 'context/payments/interface';
import { Text } from '../Profile/ScreenText/styles';
import { HeaderLink } from '../../Components/Menu/styled';
import { HeaderText } from '../../Components/PageHeader/styled';
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
import { navigate } from '../../services/navigation';
import ChoosePaymentMethod from '../../popups/ChoosePaymentMethod';
import cashPaymentMethod from './cashPaymentMethod';


export default ({
  loadingState = false,
  onAddClick = undefined,
}) => {
  const usePayments = PaymentsContext.useContainer();
  const [loading, setLoading] = useState(false);
  const [defaultMethod, setDefaultMethod] = useState({});
  const [showChoosePayment, setShowChoosePayment] = useState(false);

  const setDefaultPayment = () => {
    setLoading(true);
    const defaultPaymentMethod = usePayments.getClientDefaultMethod();
    const methodToSet = { ...defaultPaymentMethod, mark: true };
    setDefaultMethod(methodToSet);
    setLoading(false);
  };

  useEffect(() => {
    setDefaultPayment();
  }, [usePayments]);

  useEffect(() => {
    setLoading(loadingState);
  }, [loading]);


  return (
    <CardsListContainer>
      <View>
        <PaymentMethodsContainer>
          {defaultMethod && defaultMethod?.id !== cashPaymentMethod.id
            ? (
              <CardContainer>
                <CardContantContainer>
                  <CardTitleContainer>
                    <CardTitle>Default payment method</CardTitle>
                    <HeaderLink onPress={() => setShowChoosePayment(true)}>
                      <Text style={{ color: '#24aaf2' }}>
                        {i18n.t('payments.changeDefault')}
                      </Text>
                    </HeaderLink>
                  </CardTitleContainer>
                  <PaymentMethod
                    {...defaultMethod}
                    onPress={() => navigate(MAIN_ROUTES.CARD_DETAILS, { paymentMethod: defaultMethod })}
                  />
                </CardContantContainer>
              </CardContainer>
            ) : undefined}

          {usePayments.paymentMethods.length > 1 && defaultMethod
            ? (
              <CardContainer>
                <CardContantContainer>
                  <CardTitleContainer>
                    <CardTitle>other payment method</CardTitle>
                  </CardTitleContainer>
                  {usePayments.paymentMethods.map(
                    (paymentMethod : any) => (paymentMethod.id !== defaultMethod.id
                      ? (
                        <PaymentMethod
                          {...paymentMethod}
                          onPress={() => navigate(MAIN_ROUTES.CARD_DETAILS, { paymentMethod })}
                        />
                      )
                      : undefined),
                  )}
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
        <ChoosePaymentMethod
          isVisible={showChoosePayment}
          onCancel={() => { setShowChoosePayment(false); }}
          onSubmit={async (payment) => {
            const chosenDefault = usePayments.paymentMethods.find(({ id }) => id === payment) || defaultMethod;
            if (chosenDefault === defaultMethod) {
              return;
            }

            await usePayments.updatePaymentMethod(defaultMethod?.id, { isDefault: false });
            await usePayments.updatePaymentMethod(payment, { isDefault: true });
            await usePayments.loadCustomer();
            // setDefaultPayment();
          }}
        />

      </View>

    </CardsListContainer>
  );
};
