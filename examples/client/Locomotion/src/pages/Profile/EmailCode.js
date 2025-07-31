import React, { useCallback, useContext, useState } from 'react';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { PinCode } from '../../Components/PinCode';
import SaveButton from './SaveButton';
import { OnboardingContext } from '../../context/onboarding';
import {
  ErrorText, ResendButton, ResendContainer, ResendText, Line, ResendButtonText,
} from './styles';
import i18n from '../../I18n';
import Header from './Header';
import ScreenText from './ScreenText';
import { MAIN_ROUTES } from '../routes';
import { UserContext } from '../../context/user';
import { PageContainer, ContentContainer } from '../styles';
import useInterval from '../../lib/useInterval';
import * as navigationService from '../../services/navigation';

const CODE_LENGTH = 4;
const RESEND_SECONDS = 60;

const Code = () => {
  const route = useRoute();
  const { nextScreen } = useContext(OnboardingContext);
  const {
    user, onEmailVert, updateUserFromServer, verifyEmail,
  } = useContext(UserContext);
  const [code, setCode] = useState('');
  const [showErrorText, setShowErrorText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_SECONDS);

  useFocusEffect(
    useCallback(() => {
      setTimer(RESEND_SECONDS);
    }, []),
  );

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
      navigationService.navigate(MAIN_ROUTES.ACCOUNT, {
        editAccount: true,
      });
    } else {
      nextScreen(MAIN_ROUTES.EMAIL_CODE);
    }
  };

  useInterval(() => {
    setTimer((currentTimer) => {
      if (currentTimer > 0) {
        return currentTimer - 1;
      }
      return currentTimer;
    });
  }, 1000);

  return (
    <PageContainer>
      <Header title={i18n.t('onboarding.pages.emailCode.title')} page={MAIN_ROUTES.EMAIL_CODE} showSkipButton={!(route.params && route.params.editAccount)} />
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
          <Line>
            <ResendText>
              {i18n.t('onboarding.pages.emailCode.resendCodeText')}
            </ResendText>
          </Line>
          <Line>
            <ResendButton
              testID="resendEmailCode"
              disabled={timer > 0}
              onPress={() => {
                if (timer === 0) {
                  verifyEmail();
                  setTimer(RESEND_SECONDS);
                }
              }}
            >
              <ResendButtonText>
                {i18n.t('onboarding.pages.emailCode.resendCodeButton')}
              </ResendButtonText>
            </ResendButton>
            {timer > 0 ? (
              <ResendText>
                {i18n.t('onboarding.pages.emailCode.resendCodeTextSeconds', {
                  seconds: timer,
                })}
              </ResendText>
            )
              : null}
          </Line>
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
