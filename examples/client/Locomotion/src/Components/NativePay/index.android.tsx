import React from 'react';
import { ApplePayButton, useGooglePay } from '@stripe/stripe-react-native';
import Config from 'react-native-config';
import moment from 'moment';
import payments from '../../context/payments';


const ApplePay = ({
  pricingRules,
  onPaid,
}) => {
  const {
    isApplePaySupported,
    presentApplePay,
  } = useGooglePay();

  const onPress = async () => {
    const { error } = await presentApplePay({
      cartItems: [{
        amount: '0',
        label: 'intent',
        paymentType: 'Deferred',
        deferredDate: moment().add(2, 'hours').unix(),
      }],
      country: Config.DEFAULT_COUNTRY_CODE || 'US',
      currency: 'USD',
    });
    if (!error) {
      onPaid();
    }
  };

  return (
    isApplePaySupported ? (
      <ApplePayButton
        testID="apple-pay-button"
        onPress={() => onPress()}
        type="plain"
        borderRadius={4}
        style={{
          height: 25,
          width: 40,
          marginLeft: 15,
        }}
      />
    ) : null
  );
};

export default ApplePay;
