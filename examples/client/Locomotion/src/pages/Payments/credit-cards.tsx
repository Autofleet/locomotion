import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import TempraryHoldLearnMorePopup from '../../popups/TempraryHoldLearnMore';
import { MAIN_ROUTES } from '../routes';
import i18n from '../../I18n';
import {
  CardsListContainer,
  PaymentMethodsContainer,
  BottomContainer,
  TemporaryHoldView,
  TemporaryHoldText,
  LearnMore,
} from './styled';

import PaymentMethod from '../../Components/CardRow';
import PaymentsContext from '../../context/payments';
import { navigate } from '../../services/navigation';
import ChoosePaymentMethod from '../../popups/ChoosePaymentMethod';
import cashPaymentMethod from './cashPaymentMethod';
import Section from './paymentMethodSection';

export default ({
  loadingState = false,
  onAddClick = () => undefined,
}) => {
  const usePayments = PaymentsContext.useContainer();
  const [loading, setLoading] = useState(false);
  const [defaultMethod, setDefaultMethod] = useState({ id: null });
  const [showChoosePayment, setShowChoosePayment] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);

  const setDefaultPayment = async () => {
    setLoading(true);
    const { paymentMethods } = await usePayments.getOrFetchCustomer();
    const defaultPaymentMethod = paymentMethods.find((x:any) => x.isDefault);
    const methodToSet = { ...defaultPaymentMethod, mark: true };
    setDefaultMethod(methodToSet);
    setLoading(false);
  };

  useEffect(() => {
    setDefaultPayment();
  }, [usePayments.paymentMethods]);

  useEffect(() => {
    setLoading(loadingState);
  }, [loading]);


  return (
    <CardsListContainer>
      <View>
        <PaymentMethodsContainer>
          <ScrollView>
            { defaultMethod?.id && defaultMethod?.id !== cashPaymentMethod.id
              ? (
                <Section
                  title={i18n.t('payments.defaultMethodTitle')}
                  onPress={() => navigate(MAIN_ROUTES.CARD_DETAILS,
                    { paymentMethod: defaultMethod })}
                  paymentMethods={[defaultMethod]}
                  showChangeButton
                  onPressChange={() => setShowChoosePayment(true)}
                />
              ) : undefined}

            {usePayments.paymentMethods.length > 1
              ? (
                <Section
                  title={i18n.t('payments.otherMethodsTitle')}
                  showChangeButton={false}
                  onPress={(paymentMethod: any) => navigate(MAIN_ROUTES.CARD_DETAILS,
                    { paymentMethod })}
                  paymentMethods={usePayments.paymentMethods
                    .filter(({ id }) => id !== defaultMethod.id)}
                />
              ) : undefined}
          </ScrollView>
        </PaymentMethodsContainer>

        {onAddClick ? (
          <BottomContainer>
            <PaymentMethod
              addNew
              onPress={onAddClick}
            />
          </BottomContainer>
        ) : undefined}
        <TemporaryHoldView>
          <TemporaryHoldText>{i18n.t('a small amount may be temporarily placed on hold when you start your ride ')}</TemporaryHoldText>
          <TouchableOpacity onPress={() => setShowLearnMore(true)}>
            <LearnMore>
              {i18n.t('Learn more').toString()}
            </LearnMore>
          </TouchableOpacity>
        </TemporaryHoldView>
        <ChoosePaymentMethod
          onAddNewMethod={() => {
            setShowChoosePayment(false);
            onAddClick();
          }}
          selected={defaultMethod?.id}
          isVisible={showChoosePayment}
          showCash={false}
          onCancel={() => { setShowChoosePayment(false); }}
          onSubmit={async (payment) => {
            const chosenDefault = usePayments.paymentMethods.find(({ id }) => id === payment)
             || defaultMethod;
            if (chosenDefault === defaultMethod) {
              return;
            }

            await usePayments.updatePaymentMethod(payment, { isDefault: true });
            await usePayments.loadCustomer();
          }}
        />
        <TempraryHoldLearnMorePopup
          isVisible={showLearnMore}
          closePopup={() => setShowLearnMore(false)}
        />

      </View>
    </CardsListContainer>
  );
};
