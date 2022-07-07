import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { HeaderLink } from '../../Components/Menu/styled';
import { MAIN_ROUTES } from '../routes';
import i18n from '../../I18n';
import {
  CardsListContainer,
  PaymentMethodsContainer,
  MethodCard,
  ChevronIcon,
  ChangeButton,
} from './styled';
import {
  CardContainer, CardContantContainer, CardTitle, CardTitleContainer,
} from '../../Components/InformationCard/styled';

import PaymentMethod from '../../Components/CardRow';
import PaymentsContext from '../../context/payments';
import { navigate } from '../../services/navigation';
import ChoosePaymentMethod from '../../popups/ChoosePaymentMethod';
import cashPaymentMethod from './cashPaymentMethod';
import chevronIcon from '../../assets/chevron.svg';


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
                      <ChangeButton style={{ color: '#24aaf2' }}>
                        {i18n.t('payments.changeDefault')}
                      </ChangeButton>
                    </HeaderLink>
                  </CardTitleContainer>
                  <MethodCard>
                    <PaymentMethod
                      {...defaultMethod}
                      onPress={() => navigate(MAIN_ROUTES.CARD_DETAILS, { paymentMethod: defaultMethod })}
                    />
                    <ChevronIcon Svg={chevronIcon} stroke="#d7d7d7" style={{ marginTop: 25 }} />
                  </MethodCard>
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
                        <MethodCard>
                          <PaymentMethod
                            {...paymentMethod}
                            onPress={() => navigate(MAIN_ROUTES.CARD_DETAILS, { paymentMethod })}
                          />
                          <ChevronIcon Svg={chevronIcon} stroke="#d7d7d7" style={{ marginTop: 25 }} />
                        </MethodCard>
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
          }}
        />

      </View>

    </CardsListContainer>
  );
};
