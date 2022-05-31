import React, { useState } from 'react';
import * as yup from 'yup';
import TextInput from '../../../Components/TextInput';
import OnboardingNavButtons from './OnboardingNavButtons';
import onboardingContext from '../../../context/onboarding';
import { ErrorText, PageContainer, SafeView } from './styles';
import i18n from '../../../I18n';
import Header from './Header';
import ScreenText from './ScreenText';


const Email = () => {
  const {
    onboardingState, updateState, updateUserInfo, nextScreen,
  } = onboardingContext.useContainer();
  const [errorText, setErrorText] = useState(false);
  const [email, setEmail] = useState('');

  const onNext = async () => {
    try {
      await updateUserInfo({ email });
      nextScreen();
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
      updateState('email', '');
      return;
    }
    updateState('email', email);
  };

  return (
    <SafeView>
      <Header title={i18n.t('onboarding.pages.email.title')} page="email" />
      <PageContainer>
        <ScreenText
          text={i18n.t('onboarding.pages.email.text')}
          subText={i18n.t('onboarding.pages.email.subText')}
        />
        <TextInput
          autoFocus
          placeholder={i18n.t('onboarding.pages.email.placeholder')}
          onChangeText={onChange}
          value={email}
          fullBorder
        />
        {errorText && <ErrorText>{errorText}</ErrorText>}
        <OnboardingNavButtons
          isInvalid={!onboardingState.email}
          onFail={() => setErrorText(i18n.t('onboarding.pages.email.error'))}
          onNext={onNext}
        />
      </PageContainer>
    </SafeView>
  );
};

export default Email;
