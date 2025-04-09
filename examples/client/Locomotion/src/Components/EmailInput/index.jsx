import React from 'react';
import * as yup from 'yup';
import TextInput from '../TextInput';
import { InputContainer } from './styled';
import i18n from '../../I18n';

export const emailSchema = yup.object().shape({
  // eslint-disable-next-line no-useless-escape
  email: yup.string().required().email().matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
});

export const EmailInput = ({
  onChange, email, autoFocus, disabled,
}) => (
  <>
    <InputContainer>
      <TextInput
        testID="email"
        autoFocus={autoFocus}
        placeholder={i18n.t('onboarding.pages.email.placeholder')}
        onChangeText={onChange}
        value={email}
        autoCapitalize="none"
        autoCorrect={false}
        fullBorder
        disabled={disabled}
      />
    </InputContainer>
  </>
);
