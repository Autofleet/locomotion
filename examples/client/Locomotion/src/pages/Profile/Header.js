import React, { useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import PageHeader from '../../Components/PageHeader';
import backArrow from '../../assets/arrow-back.png';
import { OnboardingContext } from '../../context/onboarding';
import { UserContext } from '../../context/user';
import * as navigationService from '../../services/navigation';

const Header = ({ title, page = undefined, showSkipButton }) => {
  const { nextScreen, requiredOnboarding } = useContext(OnboardingContext);
  const { removeChangesToUser } = useContext(UserContext);
  const route = useRoute();

  const checkRequired = () => {
    if (showSkipButton !== undefined) {
      return showSkipButton;
    }

    if (!requiredOnboarding[page]) {
      return true;
    }
    return null;
  };

  const goBack = () => {
    removeChangesToUser();
    navigationService.goBack();
  };

  return (
    <PageHeader
      title={title}
      icon={backArrow}
      onIconPress={goBack}
      iconSide="left"
      displayIcon={navigationService.getNavigator().canGoBack()}
      showSkipButton={checkRequired()}
      onPressSkip={() => nextScreen(route.name)}
    />
  );
};

export default Header;
