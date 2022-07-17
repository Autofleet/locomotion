import React, { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import PinCode from '../../Components/PinCode';
import SaveButton from './SaveButton';
import { OnboardingContext } from '../../context/onboarding';
import {
  ErrorText, ResendButton, ResendContainer, ResendText, SafeView,
} from './styles';
import i18n from '../../I18n';
import Header from './Header';
import ScreenText from './ScreenText';
import { MAIN_ROUTES } from '../routes';
import { UserContext } from '../../context/user';
import { PageContainer, ContentContainer } from '../styles';

const CODE_LENGTH = 4;

const Code = () => {
  const { verifyCode } = useContext(OnboardingContext);
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [showErrorText, setShowErrorText] = useState(false);
  const [loading, setLoading] = useState(false);
  const onVertCodeChange = (value) => {
    setShowErrorText(false);
    if (value.length === CODE_LENGTH) {
      setLoading(true);
    }
    setCode(value);
  };

  const verify = async (v) => {
    const input = v || code;
    setCode(input);
    const response = await verifyCode(input);
    if (!response) {
      setLoading(false);
      return setShowErrorText(true);
    }
  };

  return (
    <PageContainer>
      <Header title={i18n.t('onboarding.pages.code.title')} page={MAIN_ROUTES.CODE} />
      <ContentContainer>
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
        <SaveButton
          isLoading={!showErrorText && code.length === CODE_LENGTH && loading}
          isInvalid={showErrorText || code.length < CODE_LENGTH || loading}
          onFail={() => setShowErrorText(true)}
        />
      </ContentContainer>
    </PageContainer>
  );
};

export default Code;
