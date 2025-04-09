import React, { useContext, useEffect, useState } from 'react';
import PhoneInput, { PhoneInputProps } from 'react-native-phone-number-input';
import Config from 'react-native-config';
import { AsYouType } from 'libphonenumber-js';
import { ThemeContext } from 'styled-components';
import { getInputIsoCode } from '../../services/MccMnc';
import i18n from '../../I18n';
import codes from './codes.json';
import { ERROR_COLOR } from '../../context/theme';

type SupportIsoCode = PhoneInputProps['defaultCode'];
const ALL_SUPPORTED_ISO_CODES_FROM_LIB: SupportIsoCode[] = [];

const PhoneNumberInput = ({
  onPhoneNumberChange,
  autoFocus,
  error,
  value,
  disabled,
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const [defaultCode, setDefaultCode] = useState<SupportIsoCode | null>(null);
  const theme = useContext(ThemeContext);
  const asYouTypePhoneNumber = new AsYouType();

  const onChangeText = (v: any) => {
    const numberValue = `${v}`;
    asYouTypePhoneNumber.input(numberValue);
    const number = asYouTypePhoneNumber.getNumberValue();
    return onPhoneNumberChange(
      number && number.replace('+', ''),
      asYouTypePhoneNumber.isValid(),
    );
  };
  const getSafeIsoCode = (rawCode: string) : SupportIsoCode => {
    const code = Config.OVERWRITE_COUNTRY_CODE || rawCode;
    if (ALL_SUPPORTED_ISO_CODES_FROM_LIB.includes(code as SupportIsoCode)) {
      return (code as SupportIsoCode);
    }
    return (Config.DEFAULT_COUNTRY_CODE as SupportIsoCode);
  };

  const setIsoCode = async () => {
    const rawMobileIso = await getInputIsoCode();
    const safeCode = getSafeIsoCode(rawMobileIso);
    setTimeout(() => {
      setDefaultCode(safeCode);
    }, 50);
  };

  const cleanNumber = (number: string) => {
    if (!number) {
      return '';
    }
    const numberCode = codes.find(c => c.code === defaultCode)?.dialCode;
    if (numberCode && number.startsWith(numberCode)) {
      return number.replace(numberCode, '');
    }
    return number;
  };

  useEffect(() => {
    setIsoCode();
  }, []);

  return defaultCode ? (
    <PhoneInput
      key={`${defaultCode}-${disabled}`}
      value={cleanNumber(value)}
      autoFocus={autoFocus}
      defaultCode={defaultCode}
      onChangeFormattedText={onChangeText}
      textInputProps={{
        returnKeyType: 'done',
        placeholderTextColor: theme.disabledColor,
        testID: 'phoneNumber',
        accessible: true,
        accessibilityLabel: 'phoneNumber',
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
      }}
      containerStyle={{
        width: '100%',
      }}
      placeholder={i18n.t('onboarding.pages.login.phonePlaceholder')}
      textContainerStyle={{
        borderRadius: 8,
        backgroundColor: '#f1f2f6',
        borderWidth: isFocused ? 0.5 : 0,
        borderColor: error ? ERROR_COLOR : '#333333',
        opacity: disabled ? 0.5 : 1,
      }}
      textInputStyle={{
        color: error ? ERROR_COLOR : '#333333',
      }}
      flagButtonStyle={{
        backgroundColor: '#f1f2f6',
        borderRadius: 8,
        marginRight: 4,
        opacity: disabled ? 0.5 : 1,
      }}
      disabled={disabled}
    />
  ) : null;
};

export default PhoneNumberInput;
