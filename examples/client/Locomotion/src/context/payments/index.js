import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { getByKey } from '../../context/settings/api';
import network from '../../services/network';
import SETTINGS_KEYS from '../settings/keys';

const BASE_PATH = '/api/v1/me/customers';

const usePayments = () => {
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

  const clientHasValidPaymentMethods = () => paymentMethods.length > 0 && paymentMethods.some(pm => !pm.isExpired);

  const getClientDefaultMethod = () => (paymentMethods || []).find(pm => pm.isDefault) || paymentMethods[0];
  const isCashPaymentEnabled = () => getByKey(SETTINGS_KEYS.CASH_ENABLED);

  const createPaymentMethod = async (paymentMethodId) => {
    const { data: paymentMethod } = await network.post(`${BASE_PATH}/${paymentMethodId}`);
    return paymentMethod;
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
  };
};

export default createContainer(usePayments);
