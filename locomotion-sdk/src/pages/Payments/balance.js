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
  CreditCardRowText
} from './styled';
import PaymentsContext from '../../context/payments'
import SubmitButton from '../../Components/RoundedButton';


export default ({ customer }) => {
  return (
        <BalanceTextContainer>
          <BalanceTitle>
            {i18n.t('payments.balance')}:
          </BalanceTitle>
          <BalanceText>
            {customer ? customer.balance : null} {customer && customer.currency ? customer.currency : null}
          </BalanceText>
        </BalanceTextContainer>
  );
};
