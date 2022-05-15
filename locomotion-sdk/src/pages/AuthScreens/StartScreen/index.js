import React, { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import SvgIcon from '../../../Components/SvgIcon';
import Logo from '../../../assets/logo.svg';
import i18n from "../../../I18n";
import onboardingContext from '../../../context/onboarding'
import { ButtonsContainer, ButtonText, StartButton, PageContainer, TermsText, TermsLink, LogoContainer } from "./styles";
import { SafeView } from "../Onboarding/styles";
import WebView from "../../WebView";
import { getLoginSettings } from "../../../context/user/api";
import Mixpanel from "../../../services/Mixpanel";
import { useRoute } from "@react-navigation/native";

const StartScreen = ({navigation}) => {
    const [webViewWindow, setWebViewWindow] = useState(null);
    const route = useRoute()
    const [settings, setSettings] = useState({
        termsUrl: null,
        privacyUrl: null,
        contactUsUrl: null,
      });

      const loadSettings = async () => {
        const settings = await getLoginSettings()
        setSettings(settings);
      };
    
      useEffect(() => {
        Mixpanel.pageView(route.name)
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
            { !webViewWindow
            ? (
                <>  
                    <LogoContainer>
                        <SvgIcon width="100px" height="100px" svg={Logo} />
                    </LogoContainer>
                    <ButtonsContainer>
                        <StartButton dark onPress={() => {
                          navigation.navigate('Phone')
                        }}>
                            <ButtonText>{i18n.t('login.signUp')}</ButtonText>
                        </StartButton>
                        <StartButton onPress={() => {
                          navigation.navigate('Phone')
                        }}>
                            <ButtonText>{i18n.t('login.login')}</ButtonText>
                        </StartButton>
                    </ButtonsContainer>
                    <TermsText>
                        <Trans i18nKey="login.termsAgreement">
                        {[
                            <TermsLink onPress={() => openTerms()} data-test-id='OpenTermsButton'/>,
                            <TermsLink onPress={() => openPrivacy()} data-test-id='OpenPrivacyButton'/>,
                        ]}
                        </Trans>
                    </TermsText>
                </>
           )
            :
                <WebView {...webViewWindow} onIconPress={() => setWebViewWindow(null)} />
            }
             </PageContainer>
        </SafeView>
    )
}

export default StartScreen;