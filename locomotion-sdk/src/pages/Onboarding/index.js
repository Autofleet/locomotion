import React, { useState } from 'react';

import network from '../../services/network';
import AppSettings from '../../services/app-settings';

import ThumbnailPicker from '../../Components/ThumbnailPicker';
import SubmitButton from '../../Components/Button/Gradient';
import TextInput from '../../Components/TextInput';
import {
  Container, Text, ErrorText, ResendButton,
} from '../Login/styled';
import { FullNameContainer } from './styled';
import I18n from '../../I18n';
import { useStateValue } from '../../context/main';

export default ({ navigation }) => {
  const [onboardingState, dispatchOnboardingState] = useState({
    uploadPromise: false,
    firstName: null,
    lastName: null,
    avatar: null,
    error: null,
  });
  const setOnboardingState = object => dispatchOnboardingState({
    ...onboardingState,
    ...object,
  });
  const submit = async () => {
    if (!onboardingState.firstName || !onboardingState.lastName) {
      setOnboardingState({
        error: I18n.t('onboarding.fullNameError'),
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
      avatar,
    };

    const response = await network.patch('api/v1/me', userProfile);

    if (response.status !== 200) {
      console.log('Got bad response from user patch');
      setOnboardingState({
        error: I18n.t('onboarding.networkError'),
      });
      return;
    }
    AppSettings.update({ userProfile });
    if(!response.data.active) {
      return navigation.navigate('Lock');
    }
    navigation.navigate('App');
  };

  const inputChange = field => value => setOnboardingState({
    [field]: value,
  });

  const onImageChoose = (uploadPromise) => {
    setOnboardingState({
      uploadPromise,
    });
  };


  return (
    <Container>
      <Text>
        {I18n.t('login.onBoardingPageTitle')}
        {onboardingState.uploadingImage}
        {onboardingState.avatar}
      </Text>
      <FullNameContainer>
        <TextInput
          placeholder={I18n.t('onboarding.firstNamePlaceholder')}
          width="48%"
          onChangeText={inputChange('firstName')}
        />
        <TextInput
          placeholder={I18n.t('onboarding.lastNamePlaceholder')}
          width="48%"
          onChangeText={inputChange('lastName')}
        />
      </FullNameContainer>
      <ThumbnailPicker
        onImageChoose={onImageChoose}
      />
      {onboardingState.error ? <ErrorText>{onboardingState.error}</ErrorText> : undefined}
      <SubmitButton onPress={submit}>
        {I18n.t('onboarding.submit')}
      </SubmitButton>
    </Container>
  );
};

export const needOnboarding = userProfile => !userProfile.firstName || !userProfile.lastName;
