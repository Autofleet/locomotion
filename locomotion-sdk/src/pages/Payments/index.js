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
  BalanceContainer,
  BalanceTitle,
  BalanceText,
  BalanceTextContainer,
  CreditCardRow,
  CreditCardImage,
  CreditCardRowText
} from './styled';
import PaymentsContext from '../../context/payments'
import SubmitButton from '../../Components/RoundedButton';
import Balance from './balance'
import CreditCardsList from './credit-cards'

export default ({ navigation, menuSide }) => {
  const [card, setCard] = useState(null);

  const { confirmPayment, handleCardAction, confirmSetupIntent } = useStripe();
  const usePayments = PaymentsContext.useContainer();
  const toggleMenu = () => {
    navigation.toggleDrawer();
  };


  const loadCustomerData = () => {
    usePayments.loadCustomer();
    usePayments.getPaymentMethods();
  }

  useEffect(() => {
    loadCustomerData();
  }, [])
/*
  useEffect(() =>  {
    console.log(usePayments.customer);
    if(usePayments.customer) {
      usePayments.getPaymentMethods()
    }
  }, [usePayments.customer]) */

  const handlePayPress = async () => {
    let customerData = usePayments.customer;
    if(!usePayments.customer) {
      customerData = await usePayments.createCustomer();
    }

    const createIntent = await usePayments.createIntent();
    console.log(createIntent);


    //setClientSecret(clientData.clientSecret)
    const billingDetails = {
      email: customerData.email,
    };
    // Create a setup intent on the backend
    //const clientSecret = await createSetupIntentOnBackend();
    const { setupIntent, error } = await confirmSetupIntent(createIntent.clientSecret, {
      type: 'Card',
      billingDetails,
    });

    console.log('setupIntent',setupIntent);

    if (error) {
      //Handle the error
      console.log(error);

    }

    loadCustomerData();
  };

  const detachCard = async (paymentMethodId) => {
    const detachData = await usePayments.detachPaymentMethod(paymentMethodId);
    console.log(detachData);

    usePayments.getPaymentMethods();
  }

  return (
    <PageContent>
      <PageHeader
        title={i18n.t('payments.pageTitle')}
        onIconPress={() => toggleMenu()}
        iconSide={menuSide}
      />
      <Balance customer={usePayments.customer} />
        <CreditCardsList paymentMethods={usePayments.paymentMethods} onDetach={detachCard} />

        {usePayments.paymentMethods.length === 0 ?
          <CreditForm>
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
              marginVertical: 30,
            }}
            onCardChange={(cardDetails) => {
              console.log(cardDetails);

              setCard(cardDetails);
            }}
            onFocus={(focusedField) => {
              console.log('focusField', focusedField);
            }}
            />
            <Text>sdsdsdssd</Text>
          </CreditForm> : null}
    <SubmitContainer>

      <SubmitButton onPress={() => handlePayPress()}>
        {i18n.t('payments.submitCard')}
      </SubmitButton>
    </SubmitContainer>
    </PageContent>
  );
};
