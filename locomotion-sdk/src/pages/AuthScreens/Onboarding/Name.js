import React, { useState, useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import TextInput from '../../../Components/TextInput';
import OnboardingNavButtons from './OnboardingNavButtons';
import { OnboardingContext } from '../../../context/onboarding';
import { ErrorText, PageContainer, SafeView, InputContainer } from './styles';
import i18n from '../../../I18n';
import Header from './Header';
import ScreenText from './ScreenText';
import { MAIN_ROUTES } from '../../routes';
import { UserContext } from '../../../context/user';

const Name = ({ navigation }) => {
  const route = useRoute();
  const { nextScreen } = useContext(OnboardingContext);
  const { updateUserInfo, user, updateState } = useContext(UserContext);
  const [showErrorText, setShowErrorText] = useState(false);
  const isFirstNameValid = user.firstName && user.firstName.trim();
  const isLastNameValid = user.lastName && user.lastName.trim();

  const inputChange = field => (value) => {
    setShowErrorText(false);
    updateState({ [field]: value });
  };

  const onComplete = async () => {
    const sanitizedNames = {
      firstName: user.firstName.trim(),
      lastName: user.lastName.trim(),
    };
    await updateUserInfo({ ...user, ...sanitizedNames });
    if (route.params && route.params.editAccount) {
      navigation.navigate(MAIN_ROUTES.ACCOUNT);
    } else {
      nextScreen(MAIN_ROUTES.NAME);
    }
  };

  return (
    <SafeView>
      <Header title={i18n.t('onboarding.pages.name.title')} page={MAIN_ROUTES.NAME} />
      <PageContainer>
        <ScreenText
          text={i18n.t('onboarding.pages.name.text')}
          subText={i18n.t('onboarding.pages.name.subText')}
        />
        <InputContainer>
        <TextInput
          placeholder={i18n.t('onboarding.firstNamePlaceholder')}
          autoFocus
          onChangeText={inputChange('firstName')}
          value={user.firstName}
          autoCapitalize="words"
          error={showErrorText && !isFirstNameValid}
          fullBorder
          />
          </InputContainer>
          <InputContainer>
        <TextInput
          placeholder={i18n.t('onboarding.lastNamePlaceholder')}
          onChangeText={inputChange('lastName')}
          value={user.lastName}
          autoCapitalize="words"
          error={showErrorText && !isLastNameValid}
          fullBorder
          />
          </InputContainer>
        {showErrorText && <ErrorText>{i18n.t('onboarding.fullNameError')}</ErrorText>}
        <OnboardingNavButtons
          isInvalid={!isFirstNameValid || !isLastNameValid}
          onFail={() => setShowErrorText(true)}
          onNext={onComplete}
        />
      </PageContainer>
    </SafeView>
  );
};

export default Name;
