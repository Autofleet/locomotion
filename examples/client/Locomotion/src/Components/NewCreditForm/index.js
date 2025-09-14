import React, { useState, useContext, useEffect } from 'react';
import {
  CardForm as MainCardForm,
  useStripe,
} from '@stripe/stripe-react-native';
import { ScrollView, View } from 'react-native';
import i18n from '../../I18n';
import PaymentsContext from '../../context/payments';
import SubmitButton from '../RoundedButton';
import { ErrorMessage, SkipSubmitContainer, SubmitContainer } from './styled';
import { Context as ThemeContext } from '../../context/theme';
import { getInputIsoCode } from '../../services/MccMnc';

const NewCreditForm = ({ onDone, canSkip = false, PageText }) => {
  const theme = useContext(ThemeContext);
  const { confirmSetupIntent } = useStripe();
  const usePayments = PaymentsContext.useContainer();

  const [loading, setLoading] = useState(false);
  const [formReady, setFormReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countryCode, setCountryCode] = useState();

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
      setLoading(false);
    } else {
      const paymentMethod = await usePayments.createPaymentMethod(setupIntent.paymentMethodId);
      await usePayments.loadCustomer();
      setLoading(false);
      await onDone(paymentMethod.id);
    }
  };

  const updateCountryCode = async () => {
    setCountryCode(await getInputIsoCode());
  };

  useEffect(() => {
    updateCountryCode();
  }, []);

  return (
    <ScrollView keyboardShouldPersistTaps="handle">
      <View>
        <PageText />
        <MainCardForm
          autofocus
          defaultValues={{
            countryCode,
          }}
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
      </View>
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
    </ScrollView>
  );
};

export default NewCreditForm;
