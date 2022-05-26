import React, { useState } from 'react';
import PhoneInput from 'react-native-phone-number-input';
import i18n from '../../I18n';
import { ERROR_COLOR } from '../../services/sharedStyles';
import codes from './codes.json';


const PhoneNumberInput = ({
  onPhoneNumberChange, defaultCode, autoFocus, error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const initialCode = codes.find(v => v.code === defaultCode);
  const [countryCode, setCountryCode] = useState(initialCode.dialCode);

  const onChangeCountry = (v) => {
    setCountryCode(v.callingCode[0]);
  };

  return (
    <PhoneInput
      autoFocus={autoFocus}
      defaultCode={defaultCode}
      onChangeText={v => onPhoneNumberChange(v, countryCode)}
      textInputProps={{
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
      }}
      onChangeCountry={onChangeCountry}
      containerStyle={{
        width: '100%',
        height: 60,
      }}
      placeholder={i18n.t('onboarding.pages.phone.placeholder')}
      textContainerStyle={{
        borderRadius: 8,
        backgroundColor: '#f1f2f6',
        borderWidth: isFocused ? 0.5 : 0,
        borderColor: error ? ERROR_COLOR : '#333333',
      }}
      textInputStyle={{
        color: error ? ERROR_COLOR : '#333333',
        height: 60,
      }}
      flagButtonStyle={{
        backgroundColor: '#f1f2f6',
        borderRadius: 8,
        marginRight: 4,
      }}
    />
  );
};


export default PhoneNumberInput;
