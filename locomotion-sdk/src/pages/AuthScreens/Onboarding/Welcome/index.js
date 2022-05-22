import { useNavigation } from '@react-navigation/native';
import React from 'react';
import i18n from '../../../../I18n';
import logo from '../../../../assets/autofleetLogo.png';
import OnboardingNavButtons from '../OnboardingNavButtons';
import {
  WelcomeSubText, WelcomeText, PageContainer, TextContainer,
} from './styles';
import onboardingContext from '../../../../context/onboarding';
import { SafeView } from '../styles';
import {
  InfoContainer, LogoContainer, Logo, OperationName, OperationSubName,
} from '../../StartScreen/styles';


const Welcome = () => {
  const { onboardingState } = onboardingContext.useContainer();
  const operation = {
    name: 'autofleet',
    subName: 'Rider app',
    logo,
  }; // replace with operation settings
  const navigation = useNavigation();
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
            {i18n.t('onboarding.pages.welcome.text', { firstName: onboardingState.firstName })}
          </WelcomeText>
          <WelcomeSubText>
            {i18n.t('onboarding.pages.welcome.subText')}
          </WelcomeSubText>
        </TextContainer>
        <OnboardingNavButtons buttonText={i18n.t('onboarding.pages.welcome.buttonText')} onNext={() => navigation.navigate('MainApp')} />
      </PageContainer>
    </SafeView>
  );
};

export default Welcome;
