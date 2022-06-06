import React, { useEffect, useRef } from 'react';
import Auth from '../../services/auth';
import SubmitButton from '../../Components/RoundedButton';
import {
  LockTextContainer, ButtonContainer, SubText, HeaderText, Text, Container,
} from './styled';
import I18n from '../../I18n';
import UserService from '../../services/user';
import { NAVIGATION_CONTAINERS } from '../routes';

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
};

export default ({ navigation }) => {
  useInterval(async () => {
    const userData = await UserService.getUser();
    if (userData === null) {
      Auth.logout(navigation);
    }

    if (userData.active === true) {
      navigation.navigate(NAVIGATION_CONTAINERS.AUTH_SCREENS);
    }
  }, 5000);

  const submit = async () => {
    Auth.logout(navigation);
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
        <SubmitButton onPress={submit} hollow data-test-id="LoginToDifferentAccountButton">
          {I18n.t('lock.submitText')}
        </SubmitButton>
      </ButtonContainer>
    </Container>
  );
};
