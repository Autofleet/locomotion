import React, { Fragment, useState, useEffect } from 'react';
import { Image, View } from 'react-native';
import propTypes from 'prop-types';
import Config from 'react-native-config';
import { Trans } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import network from '../../services/network';
import Auth from '../../services/auth';
import SubmitButton from '../../Components/RoundedButton';

import {
  Container,
  Text,
  ErrorText,
  ResendButton,
  IntoTextContainer,
  IntroText,
  SubmitContainer,
  TermsText,
  TermsLink,
} from './styled';
import I18n from '../../I18n';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import PinCode from '../../Components/PinCode';
import SafeView from '../../Components/SafeView';
import { useStateValue } from '../../context/main';
import { needOnboarding } from '../Onboarding';
import WebView from '../WebView';

const LogoIconSource = require('../../assets/logo.png');

const Login = ({ navigation, logo }) => {
  const [loginState, dispatchLoginState] = useState({
    phoneNumber: null,
    vertCode: null,
    error: null,
    loginStep: 'phoneNumber',
  });

  const [settings, setSettings] = useState({
    termsUrl: null,
    privacyUrl: null,
    contactUsUrl: null,
  });

  const loadSettings = async () => {
    const { data: settings } = await network.get('/api/v1/login/settings');
    setSettings(settings);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const [webViewWindow, setWebViewWindow] = useState(null);
  const setLoginState = object => dispatchLoginState({
    ...loginState,
    ...object,
  });

  const onPhoneNumberChange = (phoneNumber) => {
    if (!phoneNumber.valid) {
      return;
    }
    setLoginState({
      phoneNumber: phoneNumber.international,
    });
  };

  const onVertCodeChange = (vertCode) => {
    setLoginState({
      vertCode,
    });
  };

  const isVertStep = loginState.loginStep === 'vert';
  const renderRelevantInput = () => (isVertStep
    ? (
      <PinCode
        onChange={onVertCodeChange}
        onLastDigit={onVert}
      />
    )
    : (
      <PhoneNumberInput
        onNumberInput={onPhoneNumberChange}
        placeholder={I18n.t('login.phoneNumberPlaceholder')}
      />
    ));

  const [appState, dispatch] = useStateValue();

  const onVert = async () => {
    try {
      const { data: vertResponse } = await network.post('api/v1/login/vert', {
        phoneNumber: loginState.phoneNumber,
        code: loginState.vertCode,
      });

      if (vertResponse.status !== 'OK' || !vertResponse.refreshToken || !vertResponse.accessToken) {
        console.log('Bad vert with response', vertResponse);
        setLoginState({
          error: I18n.t('login.vertError'),
        });
        return;
      }

      await Auth.updateTokens(vertResponse.refreshToken, vertResponse.accessToken);
      const userProfile = vertResponse.userProfile || {};
      dispatch({
        type: 'saveState',
        payload: {
          auth: true,
          userProfile,
        },
      });

      navigation.navigate(needOnboarding(userProfile) ? 'Onboarding' : 'App', { showHeaderIcon: false });
    } catch (e) {
      console.log('Bad vert with request', e);
      setLoginState({
        error: I18n.t('login.phoneNumberError'),
      });
    }
  };

  const onSubmitPhoneNumber = async () => {
    if (!loginState.phoneNumber) {
      setLoginState({
        error: I18n.t('login.invalidPhoneNumberError'),
      });
      return;
    }

    try {
      await network.post('api/v1/login', {
        phoneNumber: loginState.phoneNumber,
      });
    } catch (e) {
      console.log('Bad login with response', e);
      setLoginState({
        error: I18n.t('login.phoneNumberError'),
      });

      return;
    }

    setLoginState({
      loginStep: 'vert',
      error: '',
    });
  };

  const resendVertCode = () => {
    setLoginState({
      loginStep: 'phoneNumber',
      vertCode: null,
    });
  };

  const openTerms = () => {
    setWebViewWindow({
      uri: settings.termsUrl,
      title: I18n.t('login.termsWebViewTitle'),
    });
  };

  const openPrivacy = () => {
    setWebViewWindow({
      uri: settings.privacyUrl,
      title: I18n.t('login.privacyWebViewTitle'),
    });
  };


  return (
    <Fragment>
      <Container>
        <KeyboardAwareScrollView>
          <SafeView>
            <Image
              style={{
                width: 200, height: 125, marginBottom: 50, marginTop: 40, marginLeft: 'auto', marginRight: 'auto',
              }}
              source={logo}
              resizeMode="contain"
            />
          </SafeView>
          <IntoTextContainer>
            {!isVertStep
              ? <IntroText>{I18n.t('login.introText')}</IntroText>
              : <Text>{I18n.t('login.verificationCodeInstructions')}</Text>}
          </IntoTextContainer>

          {renderRelevantInput()}

          {loginState.error ? <ErrorText>{loginState.error}</ErrorText> : undefined }

          {isVertStep ? <ResendButton onPress={resendVertCode}>{I18n.t('login.resendButton')}</ResendButton> : undefined}
        </KeyboardAwareScrollView>
        <SubmitContainer>

          <TermsText>
            <Trans i18nKey="login.termsAgreement">
              {[
                <TermsLink onPress={() => openTerms()} />,
                <TermsLink onPress={() => openPrivacy()} />,
              ]}
            </Trans>
          </TermsText>

          <SubmitButton onPress={isVertStep ? onVert : onSubmitPhoneNumber} marginTop="20px">
            {I18n.t(`login.${isVertStep ? 'submitVertButton' : 'submitPhoneNumberButton'}`)}
          </SubmitButton>
        </SubmitContainer>
      </Container>

      { webViewWindow
        ? (
          <View style={{
            position: 'absolute',
            top: 0,
            height: '100%',
            width: '100%',
            left: 0,
            zIndex: 10000,
            backgroundColor: '#fff',
          }}
          >
            <WebView {...webViewWindow} onIconPress={() => setWebViewWindow(null)} />
          </View>
        )
        : null}
    </Fragment>
  );
};

export default Login;

Login.defaultProps = {
  navigation: undefined,
  logo: LogoIconSource,
};

Login.propTypes = {
  navigation: propTypes.shape({}),
  logo: propTypes.any,
};
