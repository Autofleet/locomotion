import React, { useContext, useEffect, useState } from 'react';
import PhoneInput from 'react-native-phone-number-input';
import Config from 'react-native-config';
// import { AsYouType } from 'libphonenumber-js';
import { ThemeContext } from 'styled-components';
import { getInputIsoCode } from '../../services/MccMnc';
import i18n from '../../I18n';
import codes from './codes.json';
import { ERROR_COLOR } from '../../context/theme';

const PhoneNumberInput = ({
  onPhoneNumberChange,
  autoFocus,
  error,
  value,
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const [defaultCode, setDefaultCode] = 'IL';
  const theme = useContext(ThemeContext);
  // const asYouTypePhoneNumber = new AsYouType();

  // const onChangeText = (v: any) => {
  //   const numberValue = `${v}`;
  //   asYouTypePhoneNumber.input(numberValue);
  //   const number = asYouTypePhoneNumber.getNumberValue();
  //   return onPhoneNumberChange(
  //     number && number.replace('+', ''),
  //     asYouTypePhoneNumber.isValid(),
  //   );
  // };

  // const setIsoCode = async () => {
  //   const mobileIso = await getInputIsoCode();
  //   setDefaultCode(Config.OVERWRITE_COUNTRY_CODE || mobileIso);
  // };

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

  // useEffect(() => {
  //   setIsoCode();
  // }, []);

  return defaultCode ? (
    <PhoneInput
      key="IL"
      value="542053522"
      autoFocus={false}
      defaultCode="IL"
      onChangeFormattedText={() => { console.log('test'); }}
      textInputProps={{
        returnKeyType: 'done',
        placeholderTextColor: '#333333',
        testID: 'phoneNumber',
        accessible: true,
        accessibilityLabel: 'phoneNumber',
        onFocus: () => () => console.log('test'),
        onBlur: () => console.log('testblur'),
      }}
      containerStyle={{
        width: '100%',
      }}
      placeholder={i18n.t('onboarding.pages.phone.placeholder')}
      textContainerStyle={{
        borderRadius: 8,
        backgroundColor: '#f1f2f6',
        borderWidth: 0,
        borderColor: '#333333',
      }}
      textInputStyle={{
        color: '#333333',
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
