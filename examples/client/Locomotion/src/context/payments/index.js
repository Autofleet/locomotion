import { useState } from 'react';
import { createContainer } from 'unstated-next';
import cashPaymentMethod from '../../pages/Payments/cashPaymentMethod';
import { getByKey } from '../../context/settings/api';
import network from '../../services/network';
import SETTINGS_KEYS from '../settings/keys';
import SettingContext from '../settings';

const BASE_PATH = '/api/v1/me/customers';

const usePayments = () => {
  const useSettings = SettingContext.useContainer();
  const [customer, setCustomer] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const getCustomer = async () => {
    const { data: clientData } = await network.get(BASE_PATH);
    return clientData;
  };

  const loadCustomer = async () => {
    const customerData = await getCustomer();
    setCustomer(customerData);
    setPaymentMethods(customerData.paymentMethods);
    return customerData;
  };

  const getOrFetchCustomer = async () => {
    if (customer) {
      return customer;
    }

    return loadCustomer();
  };

  const setup = async () => {
    const { data: intent } = await network.post(`${BASE_PATH}/setup`);
    return intent;
  };


  const detachPaymentMethod = async (paymentMethodId) => {
    const { data: paymentMethodsData } = await network.post(`${BASE_PATH}/${paymentMethodId}/detach`);
    return paymentMethodsData;
  };

  const clientHasValidPaymentMethods = () => paymentMethods.length > 0
  && paymentMethods.some(pm => !pm.isExpired);
  const isCashPaymentEnabled = async () => useSettings.getSettingByKey(SETTINGS_KEYS.CASH_ENABLED);

  const getClientDefaultMethod = async () => {
    if (paymentMethods && paymentMethods.length) {
      return (paymentMethods || []).find(pm => pm.isDefault) || paymentMethods[0];
    }
    const cashEnabled = await isCashPaymentEnabled();
    if (cashEnabled) {
      return cashPaymentMethod;
    }
  };

  const createPaymentMethod = async (paymentMethodId) => {
    const { data: paymentMethod } = await network.post(`${BASE_PATH}/${paymentMethodId}`);
    return paymentMethod;
  };

  const updatePaymentMethod = async (paymentMethodId, values) => {
    const { data: paymentMethod } = await network.patch(`${BASE_PATH}/${paymentMethodId}`, values);
    return paymentMethod;
  };

  const getOutstandingBalance = async (paymentMethodId) => {
    const { data: balance } = await network.get(`${BASE_PATH}/${paymentMethodId}/outstanding-balance`);
    return balance;
  };

  return {
    getCustomer,
    customer,
    loadCustomer,
    setup,
    paymentMethods,
    detachPaymentMethod,
    getOrFetchCustomer,
    clientHasValidPaymentMethods,
    getClientDefaultMethod,
    isCashPaymentEnabled,
    createPaymentMethod,
    updatePaymentMethod,
    getOutstandingBalance,
  };
};

export default createContainer(usePayments);
