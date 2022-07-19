import React from 'react';
import { PageContainer } from '../styles';
import PageHeader from '../../Components/PageHeader';
import i18n from '../../I18n';

const RidePriceBreakDown = () => (
  <PageContainer>
    <PageHeader
      title={i18n.t('Payment breakdown')}
    />
  </PageContainer>
);

export default RidePriceBreakDown;
