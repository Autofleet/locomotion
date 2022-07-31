import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';
import PinCode from '../../Components/PinCode';
import SaveButton from './SaveButton';
import { OnboardingContext } from '../../context/onboarding';
import {
  ErrorText, ResendButton, ResendContainer, ResendText, SafeView, Line,
} from './styles';
import i18n from '../../I18n';
import Header from './Header';
import ScreenText from './ScreenText';
import { MAIN_ROUTES } from '../routes';
import { UserContext } from '../../context/user';
import { PageContainer, ContentContainer } from '../styles';
import useInterval from '../../lib/useInterval';

const CODE_LENGTH = 4;
const RESEND_SECONDS = 60;

const Code = () => {
  const { verifyCode } = useContext(OnboardingContext);
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [showErrorText, setShowErrorText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_SECONDS);

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
          <Line>
            <ResendText>
              {i18n.t('onboarding.pages.code.resendCodeText')}
            </ResendText>
          </Line>
          <Line>
            <ResendButton
              disabled={timer > 0}
              onPress={() => {
                if (timer === 0) {
                  navigation.navigate('Phone');
                }
              }}
            >
              {i18n.t('onboarding.pages.code.resendCodeButton')}
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
      </ContentContainer>
    </PageContainer>
  );
};

export default Code;
