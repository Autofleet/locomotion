import React, { useContext, useState } from 'react';
import { Trans } from 'react-i18next';
import logo from '../../../assets/logo.png';
import i18n from '../../../I18n';
import {
  ButtonsContainer,
  ButtonText,
  StartButton,
  PageContainer,
  TermsText,
  TermsLink,
  LogoContainer,
  Logo,
  InfoContainer,
} from './styles';
import SafeView from '../../../Components/SafeView';
import WebView from '../../WebView';
import { MAIN_ROUTES } from '../../routes';
import { UserContext } from '../../../context/user';
import { INITIAL_USER_STATE } from '../AuthLoadingScreen';
import Settings from '../../../context/settings';
import SETTING_KEYS from '../../../context/settings/keys';
import * as navigationService from '../../../services/navigation';
import AppSettings from '../../../services/app-settings';

const StartScreen = () => {
  const { setUser } = useContext(UserContext);
  const { getSettingByKey } = Settings.useContainer();
  const [webViewWindow, setWebViewWindow] = useState(null);

  const nextScreen = () => {
    AppSettings.destroy();
    setUser(INITIAL_USER_STATE);
    navigationService.navigate(MAIN_ROUTES.PHONE);
  };

  const openTerms = async () => {
    const termsOfUseUrl = await getSettingByKey(SETTING_KEYS.TERMS_OF_USE_URL);
    setWebViewWindow({
      uri: termsOfUseUrl,
      title: i18n.t('login.termsWebViewTitle'),
    });
  };

  const openPrivacy = async () => {
    const privacyPolicyUrl = await getSettingByKey(SETTING_KEYS.PRIVACY_POLICY_URL);
    setWebViewWindow({
      uri: privacyPolicyUrl,
      title: i18n.t('login.privacyWebViewTitle'),
    });
  };

  return (
    <SafeView style={{
      flex: 1,
      backgroundColor: 'white',
    }}
    >
      {!webViewWindow ? (
        <PageContainer>
          <>
            <InfoContainer>
              <LogoContainer>
                <Logo resizeMode="contain" source={logo} />
              </LogoContainer>
            </InfoContainer>
            <ButtonsContainer>
              <StartButton
                testID="loginButton"
                dark
                onPress={() => nextScreen()}
              >
                <ButtonText dark>{i18n.t('login.getStarted')}</ButtonText>
              </StartButton>
            </ButtonsContainer>
            <TermsText>
              <Trans
                i18nKey="login.termsAgreement"
              >
                {[
                  <TermsLink
                    key="OpenTermsButton"
                    onPress={() => openTerms()}
                    testID="OpenTermsButton"
                  />,
                  <TermsLink
                    key="OpenPrivacyButton"
                    onPress={() => openPrivacy()}
                    testID="OpenPrivacyButton"
                  />,
                ]}
              </Trans>
            </TermsText>
          </>
        </PageContainer>
      ) : (
        <WebView
          {...webViewWindow}
          onIconPress={() => setWebViewWindow(null)}
        />
      )}
    </SafeView>

  );
};

export default StartScreen;
