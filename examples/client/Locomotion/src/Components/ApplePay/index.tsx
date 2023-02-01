import React, { useMemo } from 'react';
import { ApplePayButton, useApplePay, ApplePayButtonComponent } from '@stripe/stripe-react-native';
import payments from '../../context/payments';


const ApplePay = () => {
  const {
    isApplePaySupported,
    presentApplePay,
  } = useApplePay();
  const paymentContext = payments.useContainer();

  const isRenderApplePayButton = useMemo(() => isApplePaySupported || paymentContext.clientHasApplePayPaymentMethod(),
    [isApplePaySupported, paymentContext.paymentMethods]);

  const onPress = async () => {
    const { error, paymentMethod } = await presentApplePay({
      cartItems: [],
      country: '',
      currency: 'USD',
    });
    if (error) {
      // handle error
    }
    await paymentContext.createPaymentMethod(paymentMethod?.id);
    await paymentContext.loadCustomer();
  };

  return (
    isRenderApplePayButton ? (
      <ApplePayButton
        testID="apple-pay-button"
        onPress={onPress}
        type="plain"
        buttonStyle="white"
        borderRadius={4}
        style={{
          height: 50,
        }}
      />
    ) : null
  );
};

export default ApplePay;
