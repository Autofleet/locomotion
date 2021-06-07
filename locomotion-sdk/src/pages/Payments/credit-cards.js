import React, { Fragment, useEffect, useState } from 'react';
import {
  CardField,
  CardFieldInput,
  useStripe,
} from '@stripe/stripe-react-native';
import LottieView from 'lottie-react-native';

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
  CreditCardRowText,
  CreditCardContainer,
  DeleteCreditCard,
  DeleteCreditCardText
} from './styled';
import PaymentsContext from '../../context/payments'
import SubmitButton from '../../Components/RoundedButton';


export default ({ paymentMethods, onDetach }) => {
  console.log('paymentMethods', paymentMethods);

  return (
    paymentMethods.map(pm => (
        <CreditCardContainer>
          <CreditCardRow>
            <CreditCardImage />
            <CreditCardRowText>{pm.card.brand}</CreditCardRowText>
            <CreditCardRowText>{pm.card.exp_month}/{pm.card.exp_year}</CreditCardRowText>
            <CreditCardRowText>{pm.card.last4}</CreditCardRowText>
          </CreditCardRow>
          <DeleteCreditCard>
            <DeleteCreditCardText onPress={() => onDetach(pm.id)}>Delete card</DeleteCreditCardText>
          </DeleteCreditCard>
        </CreditCardContainer>

      ))
  );
};
