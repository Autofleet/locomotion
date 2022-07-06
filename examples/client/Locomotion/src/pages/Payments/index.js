import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import FullPageLoader from '../../Components/FullPageLoader';
import { getTogglePopupsState } from '../../context/state';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import {
  PageContent, CreditFormText, CardContainer,
} from './styled';
import PaymentsContext from '../../context/payments';
import ConfirmationPopup from '../../popups/ConfirmationPopup';
import CreditCardsList from './credit-cards';
import NewCreditForm from '../../Components/NewCreditForm';
import { PageContainer } from '../styles';
import { MAIN_ROUTES } from '../routes';

export default ({ navigation, menuSide }) => {
  const route = useRoute();
  const usePayments = PaymentsContext.useContainer();

  const {
    paymentMethods,
  } = usePayments;
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [, togglePopup] = getTogglePopupsState();
  const hasPaymentMethods = paymentMethods && paymentMethods.length > 0;
  const [isCashEnabled, setIsCashEnabled] = useState(false);
  const [showList, setShowList] = useState(hasPaymentMethods);

  const loadCustomerData = async () => {
    await usePayments.getOrFetchCustomer();
    setPageLoading(false);
    const result = await usePayments.isCashPaymentEnabled();
    setIsCashEnabled(result.value);
  };

  useEffect(() => {
    loadCustomerData();
  }, []);

  const onPressBack = () => {
    if (!showList && hasPaymentMethods) {
      return setShowList(true);
    }
    if (route.params && route.params.back) {
      navigation.navigate(MAIN_ROUTES.ACCOUNT);
    } else {
      navigation.navigate(MAIN_ROUTES.HOME);
    }
  };
  return (
    <PageContainer>
      <PageContent>
        <PageHeader
          title={i18n.t('payments.pageTitle')}
          onIconPress={onPressBack}
          iconSide={menuSide}
        />
        {pageLoading ? <FullPageLoader autoPlay loop /> : null}
        {/* <Balance customer={usePayments.customer} /> */}
        {showList ? (
          <CreditCardsList
            isCashEnabled={isCashEnabled}
            paymentMethods={usePayments.paymentMethods}
            loadingState={loading}
            onAddClick={() => setShowList(false)}
          />
        ) : (
          <CardContainer>
            <NewCreditForm
              PageText={() => <CreditFormText>{i18n.t('payments.newCardDetails')}</CreditFormText>}
              onDone={() => (
                route.params && route.params.rideFlow
                  ? navigation.navigate(MAIN_ROUTES.HOME)
                  : setShowList(true))}
            />
          </CardContainer>
        )}
      </PageContent>
    </PageContainer>
  );
};
