import React from 'react';

import i18n from '../../I18n';
import {BalanceTitle, BalanceText, BalanceTextContainer} from './styled';

export default ({customer}) => (
  <BalanceTextContainer>
    <BalanceTitle>{i18n.t('payments.balance')}:</BalanceTitle>
    <BalanceText>
      {customer ? customer.balance : null}{' '}
      {customer && customer.currency ? customer.currency : null}
    </BalanceText>
  </BalanceTextContainer>
);
