import React, { useState, useContext } from 'react';
import {
  CardForm as MainCardForm,
  useStripe,
} from '@stripe/stripe-react-native';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import i18n from '../../I18n';
import PaymentsContext from '../../context/payments';
import SubmitButton from '../RoundedButton';
import {
  CreditForm, ErrorMessage, SkipSubmitContainer, SubmitContainer, MainCardFormContainer,
} from './styled';
import { Context as ThemeContext } from '../../context/theme';

const NewCreditForm = ({ onDone, canSkip = false, PageText }) => {
  const theme = useContext(ThemeContext);
  const { confirmSetupIntent } = useStripe();
  const usePayments = PaymentsContext.useContainer();

  const [loading, setLoading] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayPress = async () => {
    setLoading(true);
    const customerData = await usePayments.loadCustomer();
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
      await usePayments.createPaymentMethod(setupIntent.paymentMethodId);
      await usePayments.loadCustomer();
      setLoading(false);
      await onDone();
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handle">
      <CreditForm>
        <PageText />
        <MainCardForm
          autofocus
          cardStyle={{
            backgroundColor: theme.pageBackgroundColor,
            textColor: theme.textColor,
            placeholderColor: theme.disabledColor,
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
            testID="submitCardButton"
            onPress={() => handlePayPress()}
            disabled={!formReady || loading}
          >
            {i18n.t('payments.submitCard')}
          </SubmitButton>
        </SubmitContainer>

      </KeyboardAvoidingView>

    </ScrollView>
  );
};

export default NewCreditForm;
