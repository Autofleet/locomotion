import React, { useState } from 'react';
import {
  CardForm as MainCardForm,
  useStripe,
} from '@stripe/stripe-react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import i18n from '../../I18n';
import PaymentsContext from '../../context/payments';
import SubmitButton from '../RoundedButton';
import {
  CreditForm, ErrorMessage, SkipSubmitContainer, SubmitContainer,
} from './styled';

// eslint-disable-next-line import/prefer-default-export
export const NewCreditForm = ({ onDone, canSkip = false, PageText }) => {
  const { confirmSetupIntent } = useStripe();
  const usePayments = PaymentsContext.useContainer();

  const [loading, setLoading] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayPress = async () => {
    const customerData = await usePayments.getOrFetchCustomer();
    const { clientSecret } = await usePayments.setup();
    const billingDetails = {
      email: customerData.email,
    };
    const { setupIntent, error } = await confirmSetupIntent(clientSecret, {
      paymentMethodType: 'Card',
      paymentMethod: {
        billingDetails,
      },
    });

    if (error) {
      console.error(error);
      setErrorMessage(error.message);
    } else {
      await onDone();
    }
  };

  return (
    <>
      <CreditForm>
        <PageText />
        <MainCardForm
          autofocus
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
          }}
          style={{
            width: '100%',
            height: 300,
            border: 0,
          }}
          onFormComplete={(cardDetails) => {
            if (cardDetails) {
              if (formReady !== cardDetails.complete) {
                setFormReady(cardDetails.complete);
              }
            }
          }}
          onFocus={(focusedField) => {
            console.log('focusField', focusedField);
          }}
        />
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </CreditForm>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <SubmitContainer>
          {canSkip && (
            <SkipSubmitContainer>
              <SubmitButton onPress={() => onDone()} disabled={loading}>
                {i18n.t('payments.skipForNow')}
              </SubmitButton>
            </SkipSubmitContainer>
          )}
          <SubmitButton
            onPress={() => handlePayPress()}
            disabled={!formReady}
            setLoading={setLoading}
          >
            {i18n.t('payments.submitCard')}
          </SubmitButton>
        </SubmitContainer>

      </KeyboardAvoidingView>

    </>
  );
};
