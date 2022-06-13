import React, { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import network from '../services/network';

const usePayments = () => {
  const [customerSecret, setCustomerSecret] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(null);

  const getCustomer = async () => {
    const { data: clientData } = await network.get('/api/v1/me/payments/customer');
    return clientData;
  };

  const loadCustomer = async () => {
    const customerData = await getCustomer();
    if (customerData.isExist) {
      setCustomer(customerData.customer);
      return customerData;
    }
    return null;
  };

  const createCustomer = async () => {
    const { data: clientData } = await network.post('/api/v1/me/payments/customer');
    setCustomer(clientData.client);
    return clientData;
  };

  const createIntent = async () => {
    const { data: intent } = await network.post('/api/v1/me/payments/intent');
    console.log('createIntent', intent);
    return intent;
  };

  const getPaymentMethods = async () => {
    const { data: paymentMethodsData } = await network.get('/api/v1/me/payments/methods');
    setPaymentMethods(paymentMethodsData);
    return paymentMethodsData;
  };

  const detachPaymentMethod = async (paymentMethodId) => {
    const { data: paymentMethodsData } = await network.post('/api/v1/me/payments/detach', { paymentMethodId });
    return paymentMethodsData;
  };


  return {
    getCustomer,
    createCustomer,
    customerSecret,
    customer,
    loadCustomer,
    createIntent,
    getPaymentMethods,
    paymentMethods,
    detachPaymentMethod,
  };
};

export default createContainer(usePayments);
