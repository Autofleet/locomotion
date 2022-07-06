import React, { useContext, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
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
  OperationName,
  OperationSubName,
  InfoContainer,
} from './styles';
import SafeView from '../../../Components/SafeView';
import WebView from '../../WebView';
import { getLoginSettings } from '../../../context/user/api';
import Mixpanel from '../../../services/Mixpanel';
import { MAIN_ROUTES } from '../../routes';
import { UserContext } from '../../../context/user';
import { INITIAL_USER_STATE } from '../AuthLoadingScreen';

const StartScreen = () => {
  const { setUser } = useContext(UserContext);
  const navigation = useNavigation();
  const [webViewWindow, setWebViewWindow] = useState(null);
  const route = useRoute();
  const [settings, setSettings] = useState({
    termsUrl: null,
    privacyUrl: null,
    contactUsUrl: null,
  });

  const nextScreen = () => {
    setUser(INITIAL_USER_STATE);
    navigation.navigate(MAIN_ROUTES.PHONE);
  };

  const loadSettings = async () => {
    const newSettings = await getLoginSettings();
    setSettings(newSettings);
  };

  useEffect(() => {
    Mixpanel.pageView(route.name);
    loadSettings();
  }, []);

  const openTerms = () => {
    setWebViewWindow({
      uri: settings.termsUrl,
      title: i18n.t('login.termsWebViewTitle'),
    });
  };

  const openPrivacy = () => {
    setWebViewWindow({
      uri: settings.privacyUrl,
      title: i18n.t('login.privacyWebViewTitle'),
    });
  };

  return (
    <SafeView style={{
      flex: 1,
    }}
    >
      <PageContainer>
        {!webViewWindow ? (
          <>
            <InfoContainer>
              <LogoContainer>
                <Logo source={logo} />
              </LogoContainer>
              <OperationName>{i18n.t('operation.name', '')}</OperationName>
              <OperationSubName>{i18n.t('operation.subName', '')}</OperationSubName>
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
                    data-test-id="OpenTermsButton"
                  />,
                  <TermsLink
                    key="OpenPrivacyButton"
                    onPress={() => openPrivacy()}
                    data-test-id="OpenPrivacyButton"
                  />,
                ]}
              </Trans>
            </TermsText>
          </>
        ) : (
          <WebView
            {...webViewWindow}
            onIconPress={() => setWebViewWindow(null)}
          />
        )}
      </PageContainer>
    </SafeView>
  );
};

export default StartScreen;
