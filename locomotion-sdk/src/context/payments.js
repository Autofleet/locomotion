import React, { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';
import network from '../services/network';

const usePayments = () => {
  const [customer, setCustomer] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(null);

  const getCustomer = async () => {
    const { data: clientData } = await network.get('/api/v1/me/customers');
    return clientData;
  };

  const loadCustomer = async () => {
    const customerData = await getCustomer();
    setCustomer(customerData);
    return customerData;
  };

  const detachPaymentMethod = async (paymentMethodId) => {
    const { data: paymentMethodsData } = await network.post(`/api/v1/me/customers/${paymentMethodId}/detach`);
    return paymentMethodsData;
  };


  return {
    getCustomer,
    customer,
    loadCustomer,
    paymentMethods,
    detachPaymentMethod,
  };
};
export default createContainer(usePayments);
