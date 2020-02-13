import React, { useState } from 'react';
import { Image } from 'react-native';

import network from '../../services/network';
import Auth from '../../services/auth';

import SubmitButton from '../../Components/Button/Gradient';
import {
  Container, Text, ErrorText, ResendButton,
} from './styled';
import I18n from '../../I18n';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import PinCode from '../../Components/PinCode';
import SafeView from '../../Components/SafeView';
import { useStateValue } from '../../context/main';
import { needOnboarding } from '../Onboarding';

const LogoIconSource = require('../../assets/logo.png');

export default ({ navigation }) => {
  console.log('OVERWRITE LOGIN PAGE');

  const [loginState, dispatchLoginState] = useState({
    phoneNumber: null,
    vertCode: null,
    error: null,
    loginStep: 'phoneNumber',
    // loginStep: 'vert',
  });

  const setLoginState = object => dispatchLoginState({
    ...loginState,
    ...object,
  });

  const onPhoneNumberChange = (phoneNumber) => {
    console.log('phoneNumberphoneNumber', phoneNumber);
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
      console.log('DEBUG:', vertResponse);
      const userProfile = vertResponse.userProfile || {};
      dispatch({
        type: 'saveState',
        payload: {
          auth: true,
          userProfile,
        },
      });

      navigation.navigate(needOnboarding(userProfile) ? 'Onboarding' : 'App');
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

  return (
    <Container>
      <SafeView>
        <Image
          style={{ width: 150, height: 75, marginBottom: 40 }}
          source={LogoIconSource}
        />
      </SafeView>
      {renderRelevantInput()}
      <Text>{I18n.t(`${isVertStep ? 'login.verificationCodeInstructions' : 'login.loginPageInstructions'}`)}</Text>
      {loginState.error ? <ErrorText>{loginState.error}</ErrorText> : undefined }
      <SubmitButton onPress={isVertStep ? onVert : onSubmitPhoneNumber}>
        {I18n.t(`login.${isVertStep ? 'submitVertButton' : 'submitPhoneNumberButton'}`)}XXXXXX
      </SubmitButton>
      {isVertStep ? <ResendButton onPress={resendVertCode}>{I18n.t('login.resendButton')}</ResendButton> : undefined}
    </Container>
  );
};
