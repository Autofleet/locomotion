import React, { useContext, useState } from 'react';
import PhoneInput from 'react-native-phone-number-input';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../../I18n';
import OnboardingNavButtons from './OnboardingNavButtons';
import onboardingContext from '../../../context/onboarding';
import { Context as ThemeContext } from '../../../context/theme';
import { ErrorText, PageContainer, SafeView } from './styles';
import Header from './Header';
import ScreenText from './ScreenText/index';
import { loginApi } from '../../../context/user/api';

const Phone = () => {
  const theme = useContext(ThemeContext);
  const { onboardingState, updateState } = onboardingContext.useContainer();
  const navigation = useNavigation();
  const [showErrorText, setShowErrorText] = useState(false);
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
          withDarkTheme={theme.isDarkMode}
          autoFocus
          defaultCode="IL"
          onChangeText={onPhoneNumberChange}
          onChangeCountry={onChangeCountry}
          countryPickerButtonStyle={{
            color: theme.textColor,
          }}
          codeTextStyle={{
            color: theme.textColor,
          }}
          textInputStyle={{
            color: theme.textColor,
          }}
          containerStyle={{
            borderWidth: 1,
            borderColor: 'grey',
            borderRadius: 10,
            width: '100%',
            backgroundColor: theme.pageBackgroundColor,
          }}
          textContainerStyle={{
            borderLeftWidth: 1,
            borderColor: 'grey',
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            color: theme.textColor,
            backgroundColor: theme.pageBackgroundColor,
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
