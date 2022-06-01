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
import { ONBOARDING_PAGE_NAMES } from '../../../pages/consts';

const Avatar = () => {
  const {
    onboardingState, updateState, updateUserInfo, nextScreen,
  } = onboardingContext.useContainer();

  const onImageChoose = (image) => {
    updateUserInfo({ avatar: image });
    updateState('avatar', image);
  };

  return (
    <SafeView>
      <Header title={i18n.t('onboarding.pages.avatar.title')} page={ONBOARDING_PAGE_NAMES.AVATAR} />
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
          onNext={nextScreen}
          isInvalid={!onboardingState.avatar}
        />
      </PageContainer>
    </SafeView>
  );
};

export default Avatar;
