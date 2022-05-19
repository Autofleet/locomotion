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
    onboardingState, updateState, updateUserInfo, navigateBasedOnUser,
  } = onboardingContext.useContainer();
  const [errorText, setErrorText] = useState(false);
  const [email, setEmail] = useState('');

  const onNext = async () => {
    try {
      await updateUserInfo({ email });
    } catch (e) {
      console.log(e);
      setErrorText(i18n.t('onboarding.pages.email.inUseError'));
      return;
    }
    navigateBasedOnUser(onboardingState);
  };

  const onChange = async (value) => {
    setErrorText(false);
    setEmail(value);
    const schema = yup.object().shape({
      email: yup.string().required().email(),
    });

    try {
      await schema.validateAt('email', { email: value });
    } catch (e) {
      updateState('email', '');
      return;
    }
    updateState('email', email);
  };

  return (
    <SafeView>
      <Header title={i18n.t('onboarding.pages.email.title')} />
      <PageContainer>
        <ScreenText
          text={i18n.t('onboarding.pages.email.text')}
          subText={i18n.t('onboarding.pages.email.subText')}
        />
        <TextInput
          placeholder={i18n.t('onboarding.pages.email.placeholder')}
          onChangeText={onChange}
          value={email}
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
