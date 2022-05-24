import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View } from 'react-native';
import AppSettings from '../../services/app-settings';

import ThumbnailPicker from '../../Components/ThumbnailPicker';
import SubmitButton from '../../Components/RoundedButton';
import TextInput from '../../Components/TextInput';
import {
  Text, ErrorText,
} from '../Login/styled';
import {
  Container, FullNameContainer, NameContainer, SubmitContainer,
} from './styled';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import Mixpanel from '../../services/Mixpanel';
import { updateUser } from '../../context/user/api';
import { PageContainer } from '../styles';

export default ({
  navigation, screenOptions, menuSide,
}) => {
  const route = useRoute();
  const [onboardingState, dispatchOnboardingState] = useState({
    uploadPromise: false,
    firstName: '',
    lastName: '',
    email: '',
    avatar: null,
    error: null,
  });
  const [showHeaderIcon, setShowHeaderIcon] = useState(true);

  useEffect(() => {
    if (
      route.params
    ) {
      Mixpanel.pageView(route.name);
      setShowHeaderIcon(route.params.showHeaderIcon);
    }
  }, []);

  useEffect(() => {
    setFieldsData();
  }, []);

  const setOnboardingState = object => dispatchOnboardingState({
    ...onboardingState,
    ...object,
  });

  const setFieldsData = async () => {
    const { userProfile } = await AppSettings.getSettings();

    dispatchOnboardingState({
      ...onboardingState,
      ...userProfile,
    });
  };

  const submit = async () => {
    let validate = null;
    const schema = yup.object().shape({
      firstName: yup.string().required().nullable(),
      lastName: yup.string().required().nullable(),
      email: yup.string().required().email().nullable(),
    });

    try {
      validate = await schema.validate({
        firstName: onboardingState.firstName,
        lastName: onboardingState.lastName,
        email: onboardingState.email,
      }, { abortEarly: true });
    } catch (e) {
      setOnboardingState({
        error: i18n.t(`onboarding.validations.${e.type}.${e.path}`),
      });
      return;
    }

    let avatar;
    if (onboardingState.uploadPromise) {
      avatar = await onboardingState.uploadPromise;
    }

    const userProfile = {
      firstName: onboardingState.firstName,
      lastName: onboardingState.lastName,
      email: onboardingState.email,
      avatar,
    };

    const response = await updateUser(userProfile);

    if (response.status !== 200) {
      console.log('Got bad response from user patch');
      setOnboardingState({
        error: i18n.t('onboarding.networkError'),
      });
      return;
    }
    AppSettings.update({ userProfile });
    if (!response.data.active) {
      return navigation.navigate('Lock');
    }
    navigation.navigate('AddCard');
  };

  const inputChange = field => value => setOnboardingState({
    [field]: value,
  });

  const onImageChoose = (uploadPromise) => {
    setOnboardingState({
      avatar: uploadPromise,
    });
  };


  return (
    <PageContainer>
      <KeyboardAwareScrollView
        extraScrollHeight={20}
        enableOnAndroid
      >
        <PageHeader
          title={i18n.t('onboarding.pageTitle')}
          onIconPress={() => navigation.toggleDrawer()}
          displayIcon={showHeaderIcon}
          iconSide={menuSide}
        />
        <Container>
          {!showHeaderIcon
            ? (
              <Text>
                {i18n.t('login.onBoardingPageTitle')}
                {onboardingState.uploadingImage}
              </Text>
            ) : null}
          <ThumbnailPicker
            onImageChoose={onImageChoose}
            avatarSource={onboardingState.avatar}
          />
          <FullNameContainer>
            <NameContainer>
              <TextInput
                placeholder={i18n.t('onboarding.firstNamePlaceholder')}
                onChangeText={inputChange('firstName')}
                value={onboardingState.firstName}
                autoCapitalize="words"
              />
            </NameContainer>
            <NameContainer>
              <TextInput
                placeholder={i18n.t('onboarding.lastNamePlaceholder')}
                onChangeText={inputChange('lastName')}
                value={onboardingState.lastName}
                autoCapitalize="words"
              />
            </NameContainer>
          </FullNameContainer>
          <TextInput
            placeholder={i18n.t('onboarding.emailPlaceholder')}
            width="90%"
            onChangeText={inputChange('email')}
            value={onboardingState.email}
          />
          <ErrorText>{onboardingState.error ? onboardingState.error : ''}</ErrorText>
          <SubmitContainer>
            <SubmitButton
              data-test-id="FinishOnboardingButton"
              onPress={() => submit()}
            >
              {i18n.t('onboarding.submit')}
            </SubmitButton>
          </SubmitContainer>
        </Container>

      </KeyboardAwareScrollView>
    </PageContainer>
  );
};
