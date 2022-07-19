import React, { useState, useContext, useRef, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import TextInput from '../../Components/TextInput';
import SaveButton from './SaveButton';
import { OnboardingContext } from '../../context/onboarding';
import {
  ErrorText, SafeView, InputContainer,
} from './styles';
import i18n from '../../I18n';
import Header from './Header';
import ScreenText from './ScreenText';
import { MAIN_ROUTES } from '../routes';
import { UserContext } from '../../context/user';
import { PageContainer, ContentContainer } from '../styles';

const Name = ({ navigation }) => {
  const route = useRoute();
  const { nextScreen } = useContext(OnboardingContext);
  const secondTextInput = useRef(null);
  const { updateUserInfo, user } = useContext(UserContext);
  const [showErrorText, setShowErrorText] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const isFirstNameValid = firstName && firstName.trim();
  const isLastNameValid = lastName && lastName.trim();

  const isInvalid = !isFirstNameValid || !isLastNameValid;

  const onComplete = async () => {
    if (isInvalid) {
      return;
    }
    const sanitizedNames = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };
    await updateUserInfo(sanitizedNames);
    if (route.params && route.params.editAccount) {
      navigation.navigate(MAIN_ROUTES.ACCOUNT);
    } else {
      nextScreen(MAIN_ROUTES.NAME);
    }
  };

  // useEffect(() => {
  //   return () => {

  //   }
  // }, [])

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <PageContainer>
        <Header title={i18n.t('onboarding.pages.name.title')} page={MAIN_ROUTES.NAME} />
        <ContentContainer>
          <ScreenText
            text={i18n.t('onboarding.pages.name.text')}
            subText={i18n.t('onboarding.pages.name.subText')}
          />
          <InputContainer>
            <TextInput
              testID="firstNameInput"
              placeholder={i18n.t('onboarding.firstNamePlaceholder')}
              autoFocus
              onChangeText={(value) => {
                setFirstName(value);
              }}
              value={firstName}
              autoCapitalize="words"
              error={showErrorText && !isFirstNameValid}
              returnKeyType="next"
              onSubmitEditing={() => { secondTextInput.current.focus(); }}
              fullBorder
            />
          </InputContainer>
          <InputContainer>
            <TextInput
              testID="lastNameInput"
              placeholder={i18n.t('onboarding.lastNamePlaceholder')}
              onChangeText={(value) => {
                setLastName(value);
              }}
              value={lastName}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={() => { onComplete(); }}
              error={showErrorText && !isLastNameValid}
              inputRef={secondTextInput}
              fullBorder
            />
          </InputContainer>
          {showErrorText && <ErrorText>{i18n.t('onboarding.fullNameError')}</ErrorText>}
          <SaveButton
            isInvalid={isInvalid}
            onFail={() => setShowErrorText(true)}
            onNext={onComplete}
          />
        </ContentContainer>
      </PageContainer>
    </ScrollView>
  );
};

export default Name;
