import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import PinCode from '../../../Components/PinCode';
import OnboardingNavButtons from './OnboardingNavButtons';
import onboardingContext from '../../../context/onboarding';
import {
  ErrorText, PageContainer, ResendButton, ResendContainer, ResendText, SafeView,
} from './styles';
import i18n from '../../../I18n';
import Header from './Header';
import ScreenText from './ScreenText';

const Code = () => {
  const { onVert, onboardingState } = onboardingContext.useContainer();
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [showErrorText, setShowErrorText] = useState(false);
  const onVertCodeChange = (value) => {
    setShowErrorText(false);
    setCode(value);
  };

  const verify = async (v) => {
    const input = v || code;
    setCode(input);
    const response = await onVert(input);
    if (response === 'failed') {
      return setShowErrorText(true);
    }
  };
  return (
    <SafeView>
      <Header title={i18n.t('onboarding.pages.code.title')} />
      <PageContainer>
        <ScreenText
          text={i18n.t('onboarding.pages.code.text')}
          subText={i18n.t('onboarding.pages.code.subText', { phoneNumber: onboardingState.phoneNumber })}
        />
        <PinCode
          onChange={onVertCodeChange}
          onLastDigit={verify}
          error={showErrorText}
        />
        {showErrorText && <ErrorText>{i18n.t('login.vertError')}</ErrorText>}
        <ResendContainer>
          <ResendText>
            {i18n.t('onboarding.pages.code.resendCodeText')}
          </ResendText>
          <ResendButton
            onPress={() => navigation.navigate('Phone')}
          >
            {i18n.t('onboarding.pages.code.resendCodeButton')}
          </ResendButton>
        </ResendContainer>
        <OnboardingNavButtons
          isInvalid={showErrorText || code.length < 4}
          onFail={() => setShowErrorText(true)}
        />
      </PageContainer>
    </SafeView>
  );
};

export default Code;
