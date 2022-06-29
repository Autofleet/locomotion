import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-native-phone-number-input';
import Config from 'react-native-config';
import { AsYouType } from 'libphonenumber-js';
import { getInputIsoCode } from '../../services/MccMnc';
import i18n from '../../I18n';
import { ERROR_COLOR } from '../../context/theme';

const PhoneNumberInput = ({
  onPhoneNumberChange,
  autoFocus,
  error,
  value,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [defaultCode, setDefaultCode] = useState(null);
  const asYouTypePhoneNumber = new AsYouType();

  const onChangeText = (v) => {
    const numberValue = `${v}`;
    asYouTypePhoneNumber.input(numberValue);
    const number = asYouTypePhoneNumber.getNumberValue();
    return onPhoneNumberChange(
      number && number.replace('+', ''),
      asYouTypePhoneNumber.isValid(),
    );
  };

  const setIsoCode = async () => {
    const mobileIso = await getInputIsoCode();
    setDefaultCode(Config.OVERWRITE_COUNTRY_CODE || mobileIso);
  };

  useEffect(() => {
    setIsoCode();
  }, []);

  return defaultCode ? (
    <PhoneInput
      testID="phoneNumber"
      value={value}
      autoFocus={autoFocus}
      defaultCode={defaultCode}
      onChangeFormattedText={onChangeText}
      textInputProps={{
        accessible: true,
        accessibilityLabel: 'phoneNumber',
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
      }}
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
  ) : null;
};

export default PhoneNumberInput;
