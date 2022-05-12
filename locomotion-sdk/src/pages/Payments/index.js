import React, {useEffect, useState} from 'react';
import {getTogglePopupsState} from '../../context';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import {FullPageLoader, PageContent} from './styled';
import PaymentsContext from '../../context/payments'
import ConfirmationPopup from '../../popups/ConfirmationPopup';
import CreditCardsList from './credit-cards'
import { NewCreditForm } from "../../Components/NewCreditForm";

export default ({navigation, menuSide}) => {
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [methodForDelete, setMethodForDelete] = useState(null);
  const [, togglePopup] = getTogglePopupsState();

  const usePayments = PaymentsContext.useContainer();

  const toggleMenu = () => {
    navigation.toggleDrawer();
  };

  const loadCustomerData = async () => {
    const customer = await usePayments.loadCustomer();
    if (customer) {
      await usePayments.getPaymentMethods()
    }
    setPageLoading(false)
  }

  useEffect(() => {
    loadCustomerData();
  }, [])

  const detachCard = async () => {
    setLoading(true);
    await usePayments.detachPaymentMethod(methodForDelete);
    await usePayments.getPaymentMethods();
    setLoading(false);
    togglePopup('removeCard', false);
  }

  const onRemoveMethod = async (methodId) => {
    togglePopup('removeCard', true);
    setMethodForDelete(methodId);
  }

  return (
    <PageContent>
      <PageHeader
        title={i18n.t('payments.pageTitle')}
        onIconPress={() => toggleMenu()}
        iconSide={menuSide}
      />
      {pageLoading ? <FullPageLoader autoPlay loop/> : null}
      {/* <Balance customer={usePayments.customer} /> */}
      {usePayments.paymentMethods && usePayments.paymentMethods.length > 0 ? (
        <CreditCardsList
          paymentMethods={usePayments.paymentMethods}
          onDetach={onRemoveMethod}
          loadingState={loading}
        />) : (
        <NewCreditForm
          onDone={() => loadCustomerData()}
        />)}
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
  );
};
