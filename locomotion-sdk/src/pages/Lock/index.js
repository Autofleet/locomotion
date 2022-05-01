import React, { useState, useEffect, useRef } from 'react';
import Auth from '../../services/auth'
import network from '../../services/network';
import AppSettings from '../../services/app-settings';
import SubmitButton from '../../Components/RoundedButton';
import TextInput from '../../Components/TextInput';

import {
  Container, ErrorText, ResendButton
} from '../Login/styled';
import { LockTextContainer,ButtonContainer,SubText,HeaderText, Text } from './styled';
import I18n from '../../I18n';
import { useStateValue } from '../../context/main';
import UserService from '../../services/user';

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default ({ navigation }) => {
  useInterval(async () => {
    const userData = await UserService.getUser();
    if(userData === null) {
      Auth.logout(navigation)
    }

    if(userData.active === true) {
      navigation.navigate('App');
    }
  }, 5000)

  const submit = async () => {
    Auth.logout(navigation)
  };

  return (
    <Container>
      <HeaderText>{I18n.t('lock.header')}</HeaderText>
      <LockTextContainer>
         <Text>
          {I18n.t('lock.text')}
        </Text>
        <SubText>
          {I18n.t('lock.subText')}
        </SubText>

      </LockTextContainer>
      <ButtonContainer>
      <SubmitButton onPress={submit} hollow data-test-id='LoginToDifferentAccountButton'>
        {I18n.t('lock.submitText')}
      </SubmitButton>
      </ButtonContainer>
    </Container>
  );
};