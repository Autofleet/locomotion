import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import FullPageLoader from '../../Components/FullPageLoader';
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
  const [methodForDelete, setMethodForDelete] = useState(null);
  const [isRemoveCardPopupVisible, setIsRemoveCardPopupVisible] = useState(false);
  const hasPaymentMethods = paymentMethods && paymentMethods.length > 0;
  const [showList, setShowList] = useState(hasPaymentMethods);

  const loadCustomerData = async () => {
    await usePayments.getOrFetchCustomer();
    setPageLoading(false);
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
        <ConfirmationPopup
          isVisible={isRemoveCardPopupVisible}
          title={i18n.t('payments.popups.removeCard.title')}
          text={i18n.t('payments.popups.removeCard.text')}
          confirmText={i18n.t('payments.popups.removeCard.confirmText')}
          cancelText={i18n.t('payments.popups.removeCard.cancelText')}
          type="cancel"
          useCancelTextButton
          onSubmit={() => detachCard()}
          onClose={() => setIsRemoveCardPopupVisible(false)}
        />
      </PageContent>
    </PageContainer>
  );
};
