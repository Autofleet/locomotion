import React, { useContext, useEffect, useState } from 'react';
import { useIsFocused, useRoute } from '@react-navigation/native';
import SaveButton from './SaveButton';
import { OnboardingContext } from '../../context/onboarding';
import {
  ErrorText,
} from './styles';
import i18n from '../../I18n';
import Header from './Header';
import ScreenText from './ScreenText';
import { MAIN_ROUTES } from '../routes';
import { UserContext } from '../../context/user';
import { PageContainer, ContentContainer } from '../styles';
import * as navigationService from '../../services/navigation';
import { EmailInput, emailSchema } from '../../Components/EmailInput';

const Email = () => {
  const route = useRoute();
  const { nextScreen } = useContext(OnboardingContext);
  const {
    updateState, updateUserInfo, user, verifyEmail, getUserFromServer,
  } = useContext(UserContext);
  const [errorText, setErrorText] = useState(false);
  const [email, setEmail] = useState(route.params && route.params.editAccount ? user.email : '');

  const isFocused = useIsFocused();

  useEffect(() => {
    setEmail(route.params && route.params.editAccount ? user.email : ((route.params && route.params.email) || ''));
  }, [isFocused]);

  const navigateToNextScreen = () => {
    if (route.params && route.params.editAccount) {
      navigationService.navigate(MAIN_ROUTES.EMAIL_CODE, {
        editAccount: route.params.editAccount,
      });
    } else {
      nextScreen(MAIN_ROUTES.EMAIL);
    }
  };

  const onNext = async () => {
    try {
      await updateUserInfo({ email: email.toLowerCase() });
      await verifyEmail();
      navigateToNextScreen();
    } catch (e) {
      const savedUser = await getUserFromServer();
      if (savedUser.email === email.toLowerCase()) {
        return navigateToNextScreen();
      }
      setErrorText(i18n.t('onboarding.pages.email.inUseError'));
    }
  };

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

  useEffect(() => {
    if (!(route.params && route.params.editAccount)) {
      updateState({ email: '' });
    }
  }, []);

  return (
    <PageContainer>
      <Header title={i18n.t('onboarding.pages.email.title')} page={MAIN_ROUTES.EMAIL} />
      <ContentContainer>
        <ScreenText
          text={i18n.t('onboarding.pages.email.text')}
          subText={i18n.t('onboarding.pages.email.subText')}
        />
        <EmailInput
          onChange={onChange}
          email={email}
          autoFocus
        />
        {errorText && <ErrorText>{errorText}</ErrorText>}
        <SaveButton
          isInvalid={!user.email}
          onFail={() => setErrorText(i18n.t('onboarding.pages.email.error'))}
          onNext={onNext}
        />
      </ContentContainer>
    </PageContainer>
  );
};

export default Email;
