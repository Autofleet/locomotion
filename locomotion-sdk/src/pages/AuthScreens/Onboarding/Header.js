import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import PageHeader from '../../../Components/PageHeader';
import backArrow from '../../../assets/arrow-back.png';
import onboardingContext from '../../../context/onboarding';
import i18n from '../../../I18n';
import { SkipButton } from './styles';

const Header = ({ title, page }) => {
  const { requiredOnboarding } = onboardingContext.useContainer();
  const navigation = useNavigation();

  const getSkipButton = () => {
    if (!requiredOnboarding[page]) {
      return <SkipButton>{i18n.t('general.skip')}</SkipButton>
    }
    return null
  }
  return (
    <PageHeader
      title={title}
      icon={backArrow}
      onIconPress={navigation.goBack}
      iconSide="left"
      displayIcon={navigation.canGoBack()}
      SkipButton={getSkipButton()}
    />
  );
};

export default Header;
