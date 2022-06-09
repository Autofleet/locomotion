import React, { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useIsFocused, useRoute } from '@react-navigation/native';
import TextInput from '../../../Components/TextInput';
import OnboardingNavButtons from './OnboardingNavButtons';
import { OnboardingContext } from '../../../context/onboarding';
import {
  ErrorText, PageContainer, SafeView, InputContainer,
} from './styles';
import i18n from '../../../I18n';
import Header from './Header';
import ScreenText from './ScreenText';
import { MAIN_ROUTES } from '../../routes';
import { UserContext } from '../../../context/user';


const Email = ({ navigation }) => {
  const route = useRoute();
  const { nextScreen } = useContext(OnboardingContext);
  const { updateState, updateUserInfo, user } = useContext(UserContext);
  const [errorText, setErrorText] = useState(false);
  const [email, setEmail] = useState(user.email);

  const isFocused = useIsFocused();

  useEffect(() => {
    setEmail(user.email);
  }, [isFocused]);

  const onNext = async () => {
    try {
      await updateUserInfo({ email: email.toLowerCase() });
      nextScreen(MAIN_ROUTES.EMAIL);
    } catch (e) {
      setErrorText(i18n.t('onboarding.pages.email.inUseError'));
    }
  };

  const emailSchema = yup.object().shape({
    email: yup.string().required().email(),
  });

  const onChange = async (value) => {
    setErrorText(false);
    setEmail(value);

    try {
      await emailSchema.validateAt('email', { email: value });
    } catch (e) {
      updateState({ email: '' });
      return;
    }
    updateState({ email: value });
  };

  return (
    <SafeView>
      <Header title={i18n.t('onboarding.pages.email.title')} page={MAIN_ROUTES.EMAIL} />
      <PageContainer>
        <ScreenText
          text={i18n.t('onboarding.pages.email.text')}
          subText={i18n.t('onboarding.pages.email.subText')}
        />
        <InputContainer>
        <TextInput
            autoFocus
            placeholder={i18n.t('onboarding.pages.email.placeholder')}
            onChangeText={onChange}
            value={email}
            autoCapitalize="none"fullBorder
          />
          </InputContainer>
        {errorText && <ErrorText>{errorText}</ErrorText>}
        <OnboardingNavButtons
          isInvalid={!user.email}
          onFail={() => setErrorText(i18n.t('onboarding.pages.email.error'))}
          onNext={
            (route.params && route.params.editAccount
              ? () => navigation.navigate(MAIN_ROUTES.ACCOUNT)
              : onNext)
          }
        />
      </PageContainer>
    </SafeView>
  );
};

export default Email;
