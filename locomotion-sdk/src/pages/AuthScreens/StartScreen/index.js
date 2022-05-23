import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import logo from '../../../assets/autofleetLogo.png';
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
import { SafeView } from '../Onboarding/styles';
import WebView from '../../WebView';
import { getLoginSettings } from '../../../context/user/api';
import Mixpanel from '../../../services/Mixpanel';

const StartScreen = ({ navigation }) => {
  const operation = {
    name: 'autofleet',
    subName: 'Rider app',
    logo,
  }; // replace with operation settings
  const [webViewWindow, setWebViewWindow] = useState(null);
  const route = useRoute();
  const [settings, setSettings] = useState({
    termsUrl: null,
    privacyUrl: null,
    contactUsUrl: null,
  });

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
    <SafeView>
      <PageContainer>
        {!webViewWindow ? (
          <>
            <InfoContainer>
              <LogoContainer>
                <Logo source={operation.logo} />
              </LogoContainer>
              <OperationName>{operation.name}</OperationName>
              {operation.subName && <OperationSubName>{operation.subName}</OperationSubName>}
            </InfoContainer>
            <ButtonsContainer>
              <StartButton
                dark
                onPress={() => {
                  navigation.navigate('Phone');
                }}
              >
                <ButtonText dark>{i18n.t('login.signUp')}</ButtonText>
              </StartButton>
              <StartButton
                onPress={() => {
                  navigation.navigate('Phone');
                }}
              >
                <ButtonText>{i18n.t('login.login')}</ButtonText>
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
