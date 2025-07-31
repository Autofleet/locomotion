/* eslint-disable no-nested-ternary */
import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text } from 'react-native';
import { PinCode } from '../../Components/PinCode';
import SaveButton from './SaveButton';
import { OnboardingContext } from '../../context/onboarding';
import {
  ErrorText, ResendButton, ResendContainer, ResendText, SafeView,
  Line, ResendButtonText,
} from './styles';
import i18n from '../../I18n';
import Header from './Header';
import ScreenText from './ScreenText';
import { MAIN_ROUTES } from '../routes';
import { UserContext } from '../../context/user';
import { PageContainer, ContentContainer } from '../styles';
import useInterval from '../../lib/useInterval';
import Captcha from './Captcha';

const CODE_LENGTH = 4;
const RESEND_SECONDS = 60;
const RESEND_ATTEMPTS = 2;

const Code = () => {
  const { verifyCode } = useContext(OnboardingContext);
  const { user, onLogin } = useContext(UserContext);
  const [showErrorText, setShowErrorText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [resendCounter, setResendCounter] = useState(0);
  const [callCounter, setCallCounter] = useState(0);
  const [isCalling, setIsCalling] = useState(false);
  const [isRetryingLogin, setIsRetryingLogin] = useState(false);
  const [retryChannel, setRetryChannel] = useState(null);

  const onVertCodeChange = (value) => {
    setShowErrorText(false);
    if (value.length === CODE_LENGTH) {
      setLoading(true);
    }
  };

  const verify = async (v) => {
    setLoading(true);
    const input = v;
    const response = await verifyCode(input);
    if (!response) {
      return setShowErrorText(true);
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

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
    }, [showErrorText]),
  );

  useFocusEffect(
    useCallback(() => {
      setResendCounter(0);
      setCallCounter(0);
      setTimer(RESEND_SECONDS);
      setIsCalling(false);
    }, []),
  );

  const onLoginInternal = async (channel) => {
    try {
      await onLogin(user.phoneNumber, channel);
      setIsRetryingLogin(false);
      setRetryChannel(null);
    } catch (e) {
      console.log('Bad login with response', e);
      const status = e && e.response && e.response.status;
      if (status === 429) {
        setShowErrorText(i18n.t('login.tooManyRequestError'));
      }
      setIsRetryingLogin(false);
      setRetryChannel(null);
    }
  };

  const onResendPress = async () => {
    setIsRetryingLogin(true);
    setRetryChannel('sms');
    setResendCounter(currentValue => currentValue + 1);
    setTimer(RESEND_SECONDS);
  };

  const onCallPress = async () => {
    setIsRetryingLogin(true);
    setRetryChannel('call');
    setCallCounter(currentValue => currentValue + 1);
    setIsCalling(true);
  };

  const handleCaptchaClosed = () => {
    setIsRetryingLogin(false);
    setRetryChannel(null);
  };

  useEffect(() => {
    if (isCalling) {
      const callingTimeout = setTimeout(() => {
        setIsCalling(false);
      }, 10 * 1000);

      return () => {
        if (callingTimeout) {
          clearTimeout(callingTimeout);
        }
      };
    }
  }, [isCalling]);

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
          {isCalling
            ? (
              <Line>
                <ResendText>
                  {i18n.t('onboarding.pages.code.calling')}
                </ResendText>
              </Line>
            )
            : (resendCounter >= RESEND_ATTEMPTS ? (
              <Line>
                <ResendText>
                  {i18n.t('onboarding.pages.code.resendCodeText')}
                </ResendText>
                <ResendButton
                  testID="callForCode"
                  pressCount={callCounter + 1}
                  onPress={() => {
                    onCallPress();
                  }}
                >
                  <ResendButtonText>
                    {i18n.t('onboarding.pages.code.call')}
                  </ResendButtonText>
                </ResendButton>
              </Line>
            ) : null)}
          <Line>
            <ResendButton
              testID="resendPhoneNumberCode"
              pressCount={resendCounter + 1}
              disabled={timer > 0}
              onPress={() => {
                if (timer === 0) {
                  onResendPress();
                }
              }}
            >
              <ResendButtonText>
                {i18n.t('onboarding.pages.code.resendCodeButton')}
              </ResendButtonText>
            </ResendButton>
            {timer > 0 ? (
              <ResendText>
                {i18n.t('onboarding.pages.code.resendCodeTextSeconds', {
                  seconds: timer,
                })}
              </ResendText>
            )
              : null}
          </Line>
        </ResendContainer>
        <SaveButton
          isLoading={loading}
          isInvalid
          onFail={() => setShowErrorText(true)}
        />
        <Captcha
          isOpen={isRetryingLogin}
          onVerified={() => onLoginInternal(retryChannel)}
          onError={handleCaptchaClosed}
          onClose={handleCaptchaClosed}
        />
      </ContentContainer>
    </PageContainer>
  );
};

export default Code;
