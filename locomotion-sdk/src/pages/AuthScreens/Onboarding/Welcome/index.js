import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import i18n from '../../../../I18n';
import logo from '../../../../assets/autofleetLogo.png';
import OnboardingNavButtons from '../OnboardingNavButtons';
import {
  WelcomeSubText, WelcomeText, PageContainer, TextContainer,
} from './styles';
import { SafeView } from '../styles';
import {
  InfoContainer, LogoContainer, Logo, OperationName, OperationSubName,
} from '../../StartScreen/styles';
import { UserContext } from '../../../../context/user';


const Welcome = () => {
  const { updateUserInfo, user } = useContext(UserContext);
  const operation = {
    name: 'autofleet',
    subName: 'Rider app',
    logo,
  }; // replace with operation settings
  const navigation = useNavigation();

  const onNext = () => {
    updateUserInfo({ didCompleteOnboarding: true });
    navigation.navigate('MainApp');
  };
  return (
    <SafeView>
      <PageContainer>
        <InfoContainer>
          <LogoContainer>
            <Logo source={operation.logo} />
          </LogoContainer>
          <OperationName>{operation.name}</OperationName>
        </InfoContainer>
        <TextContainer>
          <WelcomeText>
            {i18n.t('onboarding.pages.welcome.text', { firstName: user.firstName })}
          </WelcomeText>
          <WelcomeSubText>
            {i18n.t('onboarding.pages.welcome.subText')}
          </WelcomeSubText>
        </TextContainer>
        <OnboardingNavButtons buttonText={i18n.t('onboarding.pages.welcome.buttonText')} onNext={onNext} />
      </PageContainer>
    </SafeView>
  );
};

export default Welcome;
