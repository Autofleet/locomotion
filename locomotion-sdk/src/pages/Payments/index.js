import React, { useEffect, useState } from 'react';
import { getTogglePopupsState } from '../../context';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import {
  FullPageLoader, PageContent, CreditFormText, CardContainer,
} from './styled';
import PaymentsContext from '../../context/payments';
import ConfirmationPopup from '../../popups/ConfirmationPopup';
import CreditCardsList from './credit-cards';
import { NewCreditForm } from '../../Components/NewCreditForm';
import { PageContainer } from '../styles';

export default ({ navigation, menuSide }) => {
  const usePayments = PaymentsContext.useContainer();

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [methodForDelete, setMethodForDelete] = useState(null);
  const [, togglePopup] = getTogglePopupsState();
  const [showList, setShowList] = useState(usePayments
    .paymentMethods && usePayments.paymentMethods.length > 0);

  const toggleMenu = () => {
    navigation.toggleDrawer();
  };

  const loadCustomerData = async () => {
    const customer = await usePayments.loadCustomer();
    if (customer) {
      await usePayments.getPaymentMethods();
    }
    setPageLoading(false);
  };

  useEffect(() => {
    loadCustomerData();
  }, []);

  const detachCard = async () => {
    setLoading(true);
    await usePayments.detachPaymentMethod(methodForDelete);
    await usePayments.getPaymentMethods();
    setLoading(false);
    togglePopup('removeCard', false);
  };

  const onRemoveMethod = async (methodId) => {
    togglePopup('removeCard', true);
    setMethodForDelete(methodId);
  };

  return (
    <PageContainer>
      <PageContent>
        <PageHeader
          title={i18n.t('payments.pageTitle')}
          onIconPress={() => toggleMenu()}
          iconSide={menuSide}
        />
        {pageLoading ? <FullPageLoader autoPlay loop /> : null}
        {/* <Balance customer={usePayments.customer} /> */}
        {showList ? (
          <CreditCardsList
            paymentMethods={usePayments.paymentMethods}
            onDetach={onRemoveMethod}
            loadingState={loading}
            onAddClick={() => setShowList(false)}
          />
        ) : (
          <CardContainer>
            <NewCreditForm
              PageText={() => <CreditFormText>{i18n.t('payments.newCardDetails')}</CreditFormText>}
              onDone={async () => {
                await loadCustomerData();
                return setShowList(true);
              }}
            />
          </CardContainer>
        )}
        <ConfirmationPopup
          name="removeCard"
          title={i18n.t('payments.popups.removeCard.title')}
          text={i18n.t('payments.popups.removeCard.text')}
          confirmText={i18n.t('payments.popups.removeCard.confirmText')}
          cancelText={i18n.t('payments.popups.removeCard.cancelText')}
          type="cancel"
          useCancelTextButton
          onSubmit={() => detachCard()}
        />
      </PageContent>
    </PageContainer>
  );
};
