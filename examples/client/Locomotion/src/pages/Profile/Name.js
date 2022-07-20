import React, {
  useState, useContext, useRef, useEffect,
} from 'react';
import { ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as yup from 'yup';
import TextInput from '../../Components/TextInput';
import SaveButton from './SaveButton';
import { OnboardingContext } from '../../context/onboarding';
import {
  ErrorText, SafeView, InputContainer, BaseErrorText
} from './styles';
import i18n from '../../I18n';
import Header from './Header';
import ScreenText from './ScreenText';
import { MAIN_ROUTES } from '../routes';
import { UserContext } from '../../context/user';
import { PageContainer, ContentContainer } from '../styles';

const nameSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[A-Za-z ]*$/, 'Name should be only letters')
    .max(40)
    .required(),
  lastName: yup
    .string()
    .matches(/^[A-Za-z ]*$/, 'Name should be only letters')
    .max(40)
    .required(),
});

const Name = ({ navigation }) => {
  const route = useRoute();
  const { nextScreen } = useContext(OnboardingContext);
  const secondTextInput = useRef(null);
  const { updateUserInfo, user } = useContext(UserContext);
  const [errors, setErrors] = useState({});
  const [showErrorText, setShowErrorText] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);

  const onComplete = async () => {
    const sanitizedNames = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };
    try {
      await nameSchema.validate(sanitizedNames, {
        abortEarly: false
      });
      await updateUserInfo(sanitizedNames);
      if (route.params && route.params.editAccount) {
        navigation.navigate(MAIN_ROUTES.ACCOUNT);
      } else {
        nextScreen(MAIN_ROUTES.NAME);
      }
    } catch (error) {
      let innerErrors = {};
      error.inner.map(({ path, message }) => {
        innerErrors = {
          ...innerErrors,
          [path]: message,
        }
      });
      setErrors(innerErrors);
    }
  };
  
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
              error={errors && errors.firstName}
              returnKeyType="next"
              onSubmitEditing={() => { secondTextInput.current.focus(); }}
              fullBorder
            />
            {errors && errors.firstName && <BaseErrorText>{errors.firstName}</BaseErrorText>}
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
              error={errors && errors.lastName}
              onSubmitEditing={() => { onComplete(); }}
              inputRef={secondTextInput}
              fullBorder
            />
            {errors && errors.lastName && <BaseErrorText>{errors.lastName}</BaseErrorText>}
          </InputContainer>
          {showErrorText && <ErrorText>{i18n.t('onboarding.fullNameError')}</ErrorText>}
          <SaveButton
            onFail={() => setShowErrorText(true)}
            onNext={onComplete}
          />
        </ContentContainer>
      </PageContainer>
    </ScrollView>
  );
};

export default Name;
