import React, { useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import PageHeader from '../../../Components/PageHeader';
import backArrow from '../../../assets/arrow-back.png';
import { OnboardingContext } from '../../../context/onboarding';
import { ONBOARDING_PAGE_NAMES } from '../../routes';

const Header = ({ title, page }) => {
  const {
    nextScreen, requiredOnboarding,
  } = useContext(OnboardingContext);
  const navigation = useNavigation();
  const route = useRoute();

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
      onPressSkip={() => nextScreen(route.name)}
    />
  );
};

export default Header;
