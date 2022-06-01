import React, { useState, useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import TextInput from '../../../Components/TextInput';
import OnboardingNavButtons from './OnboardingNavButtons';
import { OnboardingContext } from '../../../context/onboarding';
import { ErrorText, PageContainer, SafeView } from './styles';
import i18n from '../../../I18n';
import Header from './Header';
import ScreenText from './ScreenText';
import { ONBOARDING_PAGE_NAMES } from '../../routes';
import { UserContext } from '../../../context/user';

const Name = () => {
  const route = useRoute();
  const { nextScreen } = useContext(OnboardingContext);
  const { updateUserInfo, user } = useContext(UserContext);
  const [showErrorText, setShowErrorText] = useState(false);

  const inputChange = field => (value) => {
    setShowErrorText(false);
    updateUserInfo({ [field]: value });
  };

  return (
    <SafeView>
      <Header title={i18n.t('onboarding.pages.name.title')} page={ONBOARDING_PAGE_NAMES.NAME} />
      <PageContainer>
        <ScreenText
          text={i18n.t('onboarding.pages.name.text')}
          subText={i18n.t('onboarding.pages.name.subText')}
        />
        <TextInput
          placeholder={i18n.t('onboarding.firstNamePlaceholder')}
          autoFocus
          onChangeText={inputChange('firstName')}
          value={user.firstName}
          autoCapitalize="words"
          error={showErrorText && !user.firstName}
          fullBorder
        />
        <TextInput
          placeholder={i18n.t('onboarding.lastNamePlaceholder')}
          onChangeText={inputChange('lastName')}
          value={user.lastName}
          autoCapitalize="words"
          error={showErrorText && !user.lastName}
          fullBorder
        />
        {showErrorText && <ErrorText>{i18n.t('onboarding.fullNameError')}</ErrorText>}
        <OnboardingNavButtons
          isInvalid={!user.firstName || !user.lastName}
          onFail={() => setShowErrorText(true)}
          onNext={
            () => (route.params && route.params.nextScreen
              ? route.params.nextScreen() : nextScreen(ONBOARDING_PAGE_NAMES.NAME))
          }
        />
      </PageContainer>
    </SafeView>
  );
};

export default Name;
