import React, { useContext } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { APP_ROUTES, MAIN_ROUTES } from '../../routes';
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
import * as navigationService from '../../../services/navigation';

const Welcome = () => {
  const { updateUserInfo, user } = useContext(UserContext);

  const onNext = async () => {
    await updateUserInfo({ didCompleteOnboarding: true });
    navigationService.navigate(MAIN_ROUTES.HOME, {}, APP_ROUTES.MAIN_APP);
  };
  return (
    <GestureHandlerRootView>
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
    </GestureHandlerRootView>
  );
};

export default Welcome;
