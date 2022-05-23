import React, { useState } from 'react';
import PhoneInput from 'react-native-phone-number-input';
import i18n from '../../../I18n';
import OnboardingNavButtons from './OnboardingNavButtons';
import onboardingContext from '../../../context/onboarding';
import {
  ImageContainer, Name, PageContainer, SafeView,
} from './styles';
import Header from './Header';
import ScreenText from './ScreenText/index';
import ThumbnailPicker from '../../../Components/ThumbnailPicker';

const Avatar = () => {
  const {
    onboardingState, updateState, navigateBasedOnUser, updateUserInfo,
  } = onboardingContext.useContainer();

  const onImageChoose = (image) => {
    updateUserInfo({ avatar: image });
    updateState('avatar', image);
  };

  const onNext = () => {
    navigateBasedOnUser(onboardingState);
  };

  return (
    <SafeView>
      <Header title={i18n.t('onboarding.pages.avatar.title')} />
      <PageContainer>
        <ScreenText
          text={i18n.t('onboarding.pages.avatar.text')}
          subText={i18n.t('onboarding.pages.avatar.subText')}
        />
        <ImageContainer>
          <ThumbnailPicker
            onImageChoose={onImageChoose}
            avatarSource={onboardingState.avatar}
            size={125}
          />
          <Name>
            {`${onboardingState.firstName} ${onboardingState.lastName}`}
          </Name>
        </ImageContainer>
        <OnboardingNavButtons
          onNext={onNext}
          isInvalid={!onboardingState.avatar}
        />
      </PageContainer>
    </SafeView>
  );
};

export default Avatar;
