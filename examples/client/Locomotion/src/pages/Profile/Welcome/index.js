import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { APP_ROUTES } from '../../routes';
import i18n from '../../../I18n';
import logo from '../../../assets/welcomeLogo.png';
import SaveButton from '../SaveButton';
import {
  WelcomeSubText, WelcomeText, PageContainer, TextContainer,
} from './styles';
import { SafeView } from '../styles';
import {
  InfoContainer, LogoContainer, Logo,
} from '../../AuthScreens/StartScreen/styles';
import { UserContext } from '../../../context/user';

const Welcome = () => {
  const { updateUserInfo, user } = useContext(UserContext);
  const navigation = useNavigation();

  const onNext = async () => {
    await updateUserInfo({ didCompleteOnboarding: true });
    navigation.navigate(APP_ROUTES.MAIN_APP);
  };
  return (
    <SafeView>
      <PageContainer>
        <InfoContainer>
          <LogoContainer>
            <Logo resizeMode="contain" source={logo} />
          </LogoContainer>
        </InfoContainer>
        <TextContainer>
          <WelcomeText>
            {i18n.t('onboarding.pages.welcome.text', { firstName: user.firstName })}
          </WelcomeText>
          <WelcomeSubText>
            {i18n.t('onboarding.pages.welcome.subText')}
          </WelcomeSubText>
        </TextContainer>
        <SaveButton buttonText={i18n.t('onboarding.pages.welcome.buttonText')} onNext={onNext} />
      </PageContainer>
    </SafeView>
  );
};

export default Welcome;
