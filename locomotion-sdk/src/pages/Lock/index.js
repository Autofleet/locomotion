import React, { useState } from 'react';
import Auth from '../../services/auth'
import network from '../../services/network';
import AppSettings from '../../services/app-settings';
import SubmitButton from '../../Components/Button/Gradient';
import TextInput from '../../Components/TextInput';

import {
  Container, ErrorText, ResendButton
} from '../Login/styled';
import { LockTextContainer,ButtonContainer,SubText,HeaderText, Text } from './styled';
import I18n from '../../I18n';
import { useStateValue } from '../../context/main';

export default ({ navigation }) => {
  const submit = async () => {
    Auth.logout(navigation)
  };

  return (
    <Container>
      <HeaderText>
       Your signup has been recorded
      </HeaderText>
      <LockTextContainer>
         <Text>
          We have received your registration and will review it as soos as possible
        </Text>
        <SubText>
          You will immediately receive a notifiction when your regisration is completed and you are ready to use Mobility-on-Demand
        </SubText>

      </LockTextContainer>
      <ButtonContainer>
      <SubmitButton onPress={submit}>
       Login in different account
      </SubmitButton>
      </ButtonContainer>
    </Container>
  );
};