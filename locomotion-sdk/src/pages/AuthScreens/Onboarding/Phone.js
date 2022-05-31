import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../../I18n';
import OnboardingNavButtons from './OnboardingNavButtons';
import onboardingContext from '../../../context/onboarding';
import { ErrorText, PageContainer, SafeView } from './styles';
import Header from './Header';
import ScreenText from './ScreenText/index';
import { loginApi } from '../../../context/user/api';
import PhoneNumberInput from '../../../Components/PhoneNumberInput';

const Phone = () => {
  const { onboardingState, updateState, nextScreen } = onboardingContext.useContainer();
  const navigation = useNavigation();
  const [showErrorText, setShowErrorText] = useState(false);

  const onPhoneNumberChange = (phoneNumber, countryCode) => {
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
      nextScreen()
    } catch (e) {
      console.log('Bad login with response', e);
      setShowErrorText(e.message);
    }
  };

  return (
    <SafeView>
      <Header title={i18n.t('onboarding.pages.phone.title')} page={'phone'}/>
      <PageContainer>
        <ScreenText
          text={i18n.t('onboarding.pages.phone.text')}
          subText={i18n.t('onboarding.pages.phone.subText')}
        />
        <PhoneNumberInput
          onPhoneNumberChange={onPhoneNumberChange}
          autoFocus
          defaultCode="IL"
          error={showErrorText}
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
