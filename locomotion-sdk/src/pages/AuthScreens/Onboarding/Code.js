import React, { useContext, useState } from 'react';
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
import { ONBOARDING_PAGE_NAMES } from '../../routes';
import { UserContext } from '../../../context/user';

const Code = () => {
  const { verifyCode } = onboardingContext.useContainer();
  const { user } = useContext(UserContext);
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
    const response = await verifyCode(input);
    if (!response) {
      return setShowErrorText(true);
    }
  };
  return (
    <SafeView>
      <Header title={i18n.t('onboarding.pages.code.title')} page={ONBOARDING_PAGE_NAMES.CODE} />
      <PageContainer>
        <ScreenText
          text={i18n.t('onboarding.pages.code.text')}
          subText={i18n.t('onboarding.pages.code.subText', { phoneNumber: user.phoneNumber })}
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
