import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-native-phone-number-input';
import { AsYouType } from 'libphonenumber-js';
import { getInputIsoCode } from '../../services/MccMnc';
import i18n from '../../I18n';
import { ERROR_COLOR } from '../../context/theme';
import codes from './codes.json';

const PhoneNumberInput = ({
  onPhoneNumberChange,
  defaultCode,
  autoFocus,
  error,
  value,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const initialCode = codes.find(v => v.code === defaultCode);
  const [prevCountryCode, setPrevCountryCode] = useState(initialCode.dialCode);
  const [countryCode, setCountryCode] = useState(initialCode.dialCode);
  const asYouTypePhoneNUmber = new AsYouType();

  const onChangeText = (v) => {
    const numberValue = `+${countryCode}${v}`;
    asYouTypePhoneNUmber.input(numberValue);
    return onPhoneNumberChange(
      asYouTypePhoneNUmber.getNumberValue().replace('+', ''),
      asYouTypePhoneNUmber.isValid(),
    );
  };

  const changeCountryCode = (newCountryCode) => {
    setPrevCountryCode(countryCode);
    setCountryCode(newCountryCode);
  };

  const onChangeCountry = (v) => {
    changeCountryCode(v.callingCode[0]);
  };

  useEffect(() => {
    if (value) {
      onChangeText(value.substring(prevCountryCode.length));
    }
  }, [countryCode]);

  const setIsoCode = async () => {
    const mobileIso = await getInputIsoCode();
    changeCountryCode(mobileIso);
  };

  useEffect(() => {
    setIsoCode();
  }, []);

  return (
    <PhoneInput
      value={value}
      autoFocus={autoFocus}
      defaultCode={defaultCode}
      onChangeText={onChangeText}
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
