import React from 'react';
import { useNavigation } from '@react-navigation/native';
import PageHeader from '../../../Components/PageHeader';
import backArrow from '../../../assets/arrow-back.png';
import onboardingContext from '../../../context/onboarding';

const Header = ({ title, page }) => {
  const { requiredOnboarding, nextScreen } = onboardingContext.useContainer();
  const navigation = useNavigation();

  const checkRequired = () => {
    if (!requiredOnboarding[page]) {
      return true;
    }
    return null;
  };

  const goBack = () => {
    navigation.goBack()
  };
  return (
    <PageHeader
      title={title}
      icon={backArrow}
      onIconPress={goBack}
      iconSide="left"
      displayIcon={navigation.canGoBack()}
      showSkipButton={checkRequired()}
      onPressSkip={nextScreen}
    />
  );
};

export default Header;
