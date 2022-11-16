import React, { useEffect, useRef } from 'react';
import Config from 'react-native-config';
import { MAIN_ROUTES } from '../routes';
import logout from '../../services/logout';
import SubmitButton from '../../Components/RoundedButton';

import {
  LockTextContainer, ButtonContainer, SubText, HeaderText, Text, Container,
} from './styled';
import I18n from '../../I18n';
import UserService from '../../services/user';
import * as navigationService from '../../services/navigation';

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

export default () => {
  useInterval(async () => {
    const userData = await UserService.getUser();
    if (userData === null) {
      logout();
    }

    if (userData.active === true) {
      navigationService.navigate(MAIN_ROUTES.START);
    }
  }, 5000);

  const submit = async () => {
    logout();
  };

  return (
    <Container>
      <HeaderText>{I18n.t('lock.header')}</HeaderText>
      <LockTextContainer>
        <Text>
          {I18n.t('lock.text')}
        </Text>
        <SubText>
          {I18n.t('lock.subText', {
            appName: Config.OPERATION_NAME,
          })}
        </SubText>

      </LockTextContainer>
      <ButtonContainer>
        <SubmitButton onPress={submit} hollow testID="LoginToDifferentAccountButton">
          {I18n.t('lock.submitText')}
        </SubmitButton>
      </ButtonContainer>
    </Container>
  );
};
