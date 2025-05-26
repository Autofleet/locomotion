import React, { useContext, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import FullPageLoader from '../../Components/FullPageLoader';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import {
  PageContent, CreditFormText, CardContainer,
} from './styled';
import PaymentsContext from '../../context/payments';
import { RidePageContext } from '../../context/newRideContext';
import CreditCardsList from './credit-cards';
import NewCreditForm from '../../Components/NewCreditForm';
import { PageContainer } from '../styles';
import { MAIN_ROUTES } from '../routes';
import * as navigationService from '../../services/navigation';

export default ({ menuSide }) => {
  const route = useRoute();
  const usePayments = PaymentsContext.useContainer();

  const {
    paymentMethods,
  } = usePayments;
  const {
    updateRidePayload,
    updateBusinessAccountId,
  } = useContext(RidePageContext);

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const hasPaymentMethods = paymentMethods && paymentMethods.length > 0;
  const [showList, setShowList] = useState(!route.params?.showAdd);

  const loadCustomerData = async () => {
    await usePayments.getOrFetchCustomer();
    setPageLoading(false);
  };


  useEffect(() => {
    loadCustomerData();
  }, []);

  const onPressBack = () => {
    if (route.params?.rideFlow) {
      return navigationService.navigate(MAIN_ROUTES.HOME);
    }
    if (!showList && hasPaymentMethods) {
      return setShowList(true);
    }
    if (route.params && route.params.back) {
      navigationService.navigate(MAIN_ROUTES.ACCOUNT);
    } else {
      navigationService.navigate(MAIN_ROUTES.HOME);
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
            paymentMethods={usePayments.paymentMethods}
            loadingState={loading}
            onAddClick={() => setShowList(false)}
          />
        ) : (
          <CardContainer>
            <NewCreditForm
              PageText={() => <CreditFormText>{i18n.t('payments.newCardDetails')}</CreditFormText>}
              onDone={async (paymentMethodId) => {
                if (route.params && route.params.rideFlow) {
                  updateRidePayload({
                    paymentMethodId,
                  });
                  await updateBusinessAccountId(null);
                  navigationService.navigate(MAIN_ROUTES.HOME);
                } else {
                  setShowList(true);
                }
              }}
            />
          </CardContainer>
        )}
      </PageContent>
    </PageContainer>
  );
};
