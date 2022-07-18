import React, { useContext, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import PinCode from '../../Components/PinCode';
import SaveButton from './SaveButton';
import { OnboardingContext } from '../../context/onboarding';
import {
  ErrorText, ResendButton, ResendContainer, ResendText,
} from './styles';
import i18n from '../../I18n';
import Header from './Header';
import ScreenText from './ScreenText';
import { MAIN_ROUTES } from '../routes';
import { UserContext } from '../../context/user';
import { PageContainer, ContentContainer } from '../styles';

const CODE_LENGTH = 4;

const Code = () => {
  const route = useRoute();
  const { nextScreen } = useContext(OnboardingContext);
  const { user, onEmailVert, updateUserFromServer } = useContext(UserContext);
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
    const response = await onEmailVert(input);
    if (!response) {
      setLoading(false);
      return setShowErrorText(true);
    }
    await updateUserFromServer();
    if (route.params && route.params.editAccount) {
      navigation.navigate(MAIN_ROUTES.ACCOUNT, {
        editAccount: true,
      });
    } else {
      nextScreen(MAIN_ROUTES.EMAIL_CODE);
    }
  };

  return (
    <PageContainer>
      <Header title={i18n.t('onboarding.pages.emailCode.title')} page={MAIN_ROUTES.EMAIL_CODE} />
      <ContentContainer>
        <ScreenText
          text={i18n.t('onboarding.pages.emailCode.text')}
          subText={i18n.t('onboarding.pages.emailCode.subText', { email: user.email })}
        />
        <PinCode
          onChange={onVertCodeChange}
          onLastDigit={verify}
          error={showErrorText}
        />
        {showErrorText && <ErrorText>{i18n.t('login.vertError')}</ErrorText>}
        <ResendContainer>
          <ResendText>
            {i18n.t('onboarding.pages.emailCode.resendCodeText')}
          </ResendText>
          <ResendButton
            onPress={() => navigation.navigate(MAIN_ROUTES.EMAIL, {
              editAccount: true,
            })}
          >
            {i18n.t('onboarding.pages.emailCode.resendCodeButton')}
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
