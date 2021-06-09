import React, { Fragment, useEffect, useState } from 'react';
import {Text} from 'react-native';
import {
  CardField,
  CardFieldInput,
  useStripe,
} from '@stripe/stripe-react-native';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import {
  PageContent,
  SubmitContainer,
  CreditForm,
  ErrorMessage,
  FullPageLoader,
  CreditFormText
} from './styled';
import PaymentsContext from '../../context/payments'
import SubmitButton from '../../Components/RoundedButton';
import Balance from './balance'
import CreditCardsList from './credit-cards'

export default ({ navigation, menuSide }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  const { confirmPayment, handleCardAction, confirmSetupIntent } = useStripe();
  const usePayments = PaymentsContext.useContainer();
  const toggleMenu = () => {
    navigation.toggleDrawer();
  };

  const loadCustomerData = async () => {
    const customer = await usePayments.loadCustomer();
    if(customer) {
      await usePayments.getPaymentMethods()
    }
    setPageLoading(false)
  }

  useEffect(() => {
    loadCustomerData();
  }, [])

  const handlePayPress = async () => {
    let customerData = usePayments.customer;
    if(!usePayments.customer) {
      customerData = await usePayments.createCustomer();
    }
    const createIntent = await usePayments.createIntent();
    const billingDetails = {
      email: customerData.email,
    };
    const { setupIntent, error } = await confirmSetupIntent(createIntent.clientSecret, {
      type: 'Card',
      billingDetails,
    });

    if (error) {
      console.log(error);
      setErrorMessage(error.message)
    }

    await loadCustomerData();
  };

  const detachCard = async (paymentMethodId) => {
    await usePayments.detachPaymentMethod(paymentMethodId);
    await usePayments.getPaymentMethods();
  }

  return (
    <PageContent>
      <PageHeader
        title={i18n.t('payments.pageTitle')}
        onIconPress={() => toggleMenu()}
        iconSide={menuSide}
      />
       {pageLoading ? <FullPageLoader autoPlay loop /> : null}
        <Balance customer={usePayments.customer} />
        {usePayments.paymentMethods.length > 0 ?
        <CreditCardsList paymentMethods={usePayments.paymentMethods} onDetach={detachCard} /> :
        <>
          <CreditForm>
            <CreditFormText>{i18n.t('payments.newCardDetails')}</CreditFormText>
            <CardField
            postalCodeEnabled={false}
            placeholder={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={{
              backgroundColor: '#FFFFFF',
              textColor: '#000000',
            }}
            style={{
              width: '100%',
              height: 50,
            }}
            onCardChange={(cardDetails) => {
              console.log(cardDetails);
            }}
            onFocus={(focusedField) => {
              console.log('focusField', focusedField);
            }}
            />
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </CreditForm>
          <SubmitContainer>
            <SubmitButton onPress={() => handlePayPress()}>
              {i18n.t('payments.submitCard')}
            </SubmitButton>
          </SubmitContainer>
          </>
      }
    </PageContent>
  );
};
