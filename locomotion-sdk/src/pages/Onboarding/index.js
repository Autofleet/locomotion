import React, { useState, useEffect, Fragment } from 'react';
import * as yup from 'yup';

import network from '../../services/network';
import AppSettings from '../../services/app-settings';

import ThumbnailPicker from '../../Components/ThumbnailPicker';
import SubmitButton from '../../Components/Button/Gradient';
import TextInput from '../../Components/TextInput';
import {
  Container, Text, ErrorText, ResendButton,
} from '../Login/styled';
import { FullNameContainer } from './styled';
import i18n from '../../I18n';
import { useStateValue } from '../../context/main';
import PageHeader from '../../Components/PageHeader';



export default ({ navigation, screenOptions, ...props }) => {
  const [onboardingState, dispatchOnboardingState] = useState({
    uploadPromise: false,
    firstName: '',
    lastName: '',
    email: '',
    avatar: null,
    error: null,
  });
  const [showHeaderIcon, setShowHeaderIcon] = useState(true)

  useEffect(() => {
    setShowHeaderIcon(navigation.getParam('showHeaderIcon',true));
  }, [])

  useEffect(() => {
    setFieldsData();
  }, [])
  const setOnboardingState = object => dispatchOnboardingState({
    ...onboardingState,
    ...object,
  });

  const setFieldsData = async () => {
    const {userProfile} = await AppSettings.getSettings();
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
      }, {abortEarly: true});
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

    const response = await network.patch('api/v1/me', userProfile);

    if (response.status !== 200) {
      console.log('Got bad response from user patch');
      setOnboardingState({
        error: i18n.t('onboarding.networkError'),
      });
      return;
    }
    AppSettings.update({userProfile});
    if (!response.data.active) {
      return navigation.navigate('Lock');
    }
    navigation.navigate('Home');
  };

  const inputChange = field => value => {
    return setOnboardingState({
    [field]: value,
  })
};

  const onImageChoose = (uploadPromise) => {
    setOnboardingState({
      uploadPromise,
    });
  };


  return (
      <Fragment>

        <PageHeader title={i18n.t('onboarding.pageTitle')}
                    onIconPress={() => navigation.toggleDrawer()}
                    displayIcon={showHeaderIcon}
        />
        <Container>
          <Text>
            {i18n.t('login.onBoardingPageTitle')}
            {onboardingState.uploadingImage}
            {onboardingState.avatar}
          </Text>
          <ThumbnailPicker
              onImageChoose={onImageChoose}
          />
          <FullNameContainer>
            <TextInput
                placeholder={i18n.t('onboarding.firstNamePlaceholder')}
                width="95%"
                onChangeText={inputChange('firstName')}
                value={onboardingState.firstName}
            />
            <TextInput
                placeholder={i18n.t('onboarding.lastNamePlaceholder')}
                width="95%"
                onChangeText={inputChange('lastName')}
                value={onboardingState.lastName}
            />
            <TextInput
                placeholder={i18n.t('onboarding.emailPlaceholder')}
                width="95%"
                onChangeText={inputChange('email')}
                value={onboardingState.email}
            />
          </FullNameContainer>
          <ErrorText>{onboardingState.error ? onboardingState.error : ''}</ErrorText>
          <SubmitButton onPress={submit}>
            {i18n.t('onboarding.submit')}
          </SubmitButton>
        </Container>
      </Fragment>
  );
};

export const needOnboarding = userProfile => !userProfile.firstName || !userProfile.lastName || !userProfile.email;
