import React, { useState } from 'react';
import PhoneInput from 'react-native-phone-number-input';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../../I18n';
import OnboardingNavButtons from './OnboardingNavButtons';
import onboardingContext from '../../../context/onboarding';
import { ErrorText, PageContainer, SafeView } from './styles';
import Header from './Header';
import ScreenText from './ScreenText/index';
import { loginApi } from '../../../context/user/api';
import { ERROR_COLOR } from '../../../services/sharedStyles';

const Phone = () => {
  const { onboardingState, updateState } = onboardingContext.useContainer();
  const navigation = useNavigation();
  const [showErrorText, setShowErrorText] = useState(false);
  const [isFocused, setIsFocused] = useState(false)
  const [countryCode, setCountryCode] = useState('972');
  const onPhoneNumberChange = (phoneNumber) => {
    setShowErrorText(false);
    if (phoneNumber.length < 9) {
      return updateState('phoneNumber', '');
    }
    updateState('phoneNumber', countryCode + phoneNumber);
  };

  const onSubmitPhoneNumber = async () => {
    try {
      await loginApi({
        phoneNumber: onboardingState.phoneNumber,
      });
      navigation.navigate('Code');
    } catch (e) {
      console.log('Bad login with response', e);
      setShowErrorText(e.message);
    }
  };

  const onChangeCountry = (v) => {
    setCountryCode(v.callingCode[0]);
  };

  return (
    <SafeView>
      <Header title={i18n.t('onboarding.pages.phone.title')} />
      <PageContainer>
        <ScreenText
          text={i18n.t('onboarding.pages.phone.text')}
          subText={i18n.t('onboarding.pages.phone.subText')}
        />
        <PhoneInput
          autoFocus
          defaultCode="IL"
          onChangeText={onPhoneNumberChange}
          textInputProps={{
            onFocus: () => setIsFocused(true),
            onBlur: () => setIsFocused(false)
          }}
          onChangeCountry={onChangeCountry}
          containerStyle={{
            width: '100%',
          }}
          placeholder={i18n.t('onboarding.pages.phone.placeholder')}
          textContainerStyle={{
            borderRadius: 8,
            backgroundColor: '#f1f2f6',
            borderWidth: isFocused ? .5 : 0,
            borderColor: showErrorText ? ERROR_COLOR : '#333333',
          }}
          textInputStyle={{
            color: showErrorText ? ERROR_COLOR : '#333333'
          }}
          flagButtonStyle={{
            backgroundColor: '#f1f2f6',
            borderRadius: 8,
            marginRight: 4
          }}
        />
        {showErrorText && <ErrorText>{showErrorText}</ErrorText>}
        <OnboardingNavButtons
          isInvalid={!onboardingState.phoneNumber}
          onNext={onSubmitPhoneNumber}
          onFail={() => setShowErrorText(i18n.t('login.invalidPhoneNumberError'))}
        />
      </PageContainer>
    </SafeView>
  );
};

export default Phone;
