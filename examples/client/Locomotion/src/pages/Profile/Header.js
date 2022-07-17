import React, { useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import PageHeader from '../../Components/PageHeader';
import backArrow from '../../assets/arrow-back.png';
import { OnboardingContext } from '../../context/onboarding';
import { UserContext } from '../../context/user';

const Header = ({ title, page = undefined, showSkipButton }) => {
  const { nextScreen, requiredOnboarding } = useContext(OnboardingContext);
  const { removeChangesToUser } = useContext(UserContext);
  const navigation = useNavigation();
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
    navigation.goBack();
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
