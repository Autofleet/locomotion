import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { degreesToRadians } from '@turf/turf';
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
import Section from './paymentMethodSection';

export default ({
  loadingState = false,
  onAddClick = undefined,
}) => {
  const usePayments = PaymentsContext.useContainer();
  const [loading, setLoading] = useState(false);
  const [defaultMethod, setDefaultMethod] = useState({
    ...usePayments.getClientDefaultMethod(),
    mark: true,
  });
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
          {defaultMethod && defaultMethod.id !== cashPaymentMethod.id
            ? (
              <Section
                onPress={() => navigate(MAIN_ROUTES.CARD_DETAILS, { paymentMethod: defaultMethod })}
                paymentMethods={[defaultMethod]}
                showChangeButton
                onPressChange={() => setShowChoosePayment(true)}
              />
            ) : undefined}

          {usePayments.paymentMethods.length > 1 && defaultMethod
            ? (
              <Section
                showChangeButton={false}
                onPress={(paymentMethod: any) => navigate(MAIN_ROUTES.CARD_DETAILS,
                  { paymentMethod })}
                paymentMethods={usePayments.paymentMethods
                  .filter(({ id }) => id !== defaultMethod.id)}
                onPressChange={undefined}
              />
            ) : undefined}
        </PaymentMethodsContainer>

        {onAddClick ? (
          <PaymentMethod
            addNew
            onPress={onAddClick}
          />
        ) : undefined}
        <ChoosePaymentMethod
          isVisible={showChoosePayment}
          showCash={false}
          onCancel={() => { setShowChoosePayment(false); }}
          onSubmit={async (payment) => {
            const chosenDefault = usePayments.paymentMethods.find(({ id }) => id === payment)
             || defaultMethod;
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
