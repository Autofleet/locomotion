import React, { useState, useEffect } from 'react';
import {
  Linking, Platform, UIManager, findNodeHandle, ActionSheetIOS,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import NoTitleCard from '../../Components/NoTitleCard';
import { MAIN_ROUTES } from '../routes';
import i18n from '../../I18n';
import WebView from '../WebView';
import PageHeader from '../../Components/PageHeader';
import { PageContainer } from '../styles';
import { Container, CardsContainer } from '../Account/styled';
import Card from '../../Components/InformationCard';
import CardsTitle from '../../Components/CardsTitle';
import { Text } from '../Profile/ScreenText/styles';
import logo from '../../assets/welcomeLogo.png';
import settingsContext from '../../context/settings';
import arrowBack from '../../assets/arrow-back-learn-more.svg';
import phoneIcon from '../../assets/phone.svg';
import emailIcon from '../../assets/email.svg';
import {
  ContactUsLogo,
  ContactUsPageLogoContainer,
  ContactUsPageView, LearnMoreButton, LearnMoreIcon, LearnMoreText,
} from './styled';
import * as navigationService from '../../services/navigation';
import Mixpanel from '../../services/Mixpanel';
import DeviceService from '../../services/device';

export default ({ menuSide }) => {
  const useSettings = settingsContext.useContainer();
  const [webViewWindow, setWebViewWindow] = useState(null);
  const [settings, setSettings] = useState({
    termsUrl: null,
    privacyUrl: null,
    contactUsUrl: null,
    contactUsText: null,
    contactEmail: null,
    contactPhone: null,
  });

  useEffect(() => {
    const loadSettings = async () => {
      const settingsData = await useSettings.getLoginSettings();
      setSettings(settingsData);
    };

    loadSettings();
  }, []);

  const openTerms = () => {
    setWebViewWindow({
      uri: settings.termsOfUseUrl,
      title: i18n.t('login.termsWebViewTitle'),
    });
  };

  const openPrivacy = () => {
    setWebViewWindow({
      uri: settings.privacyPolicyUrl,
      title: i18n.t('login.privacyWebViewTitle'),
    });
  };

  const openContactUs = async () => {
    if (Linking.canOpenURL(settings.contactUsUrl)) {
      Linking.openURL(settings.contactUsUrl);
    } else {
      console.log('contact us link is not supported');
    }
  };

  const ActionMenu = (event, number) => {
    const callPhone = (phoneNumber) => {
      Mixpanel.clickEvent('Call support', { phoneNumber });
      DeviceService.call(phoneNumber);
    };

    const smsPhone = (phoneNumber) => {
      Mixpanel.clickEvent('SMS support', { phoneNumber });
      DeviceService.sms(phoneNumber, '');
    };

    const options = [i18n.t('bottomSheetContent.ride.phoneCallOptions.call'), i18n.t('bottomSheetContent.ride.phoneCallOptions.sms')];
    if (Platform.OS === 'android') {
      UIManager.showPopupMenu(
        findNodeHandle(event.target),
        options,
        () => undefined,
        (action, buttonIndex) => {
          if (buttonIndex === 0) {
            callPhone(number);
          }

          if (buttonIndex === 1) {
            smsPhone(number);
          }
        },
      );
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [i18n.t('bottomSheetContent.ride.phoneCallOptions.cancel'), ...options],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            callPhone(number);
          }

          if (buttonIndex === 2) {
            smsPhone(number);
          }
        },
      );
    }
  };

  return (
    <PageContainer>
      {!webViewWindow ? (
        <>
          <ContactUsPageView>
            <PageHeader
              showShadow={false}
              title={i18n.t('contactUs.pageTitle')}
              onIconPress={() => navigationService.navigate(MAIN_ROUTES.HOME)}
              iconSide={menuSide}
            />
            <ScrollView>
              <ContactUsPageLogoContainer style={Platform.OS === 'android' ? { shadowColor: '#000' } : {}}>
                <ContactUsLogo resizeMode="contain" source={logo} />
              </ContactUsPageLogoContainer>
              <Container>
                {settings.contactEmail || settings.contactPhone || settings.contactUsUrl ? (
                  <CardsContainer>
                    <CardsTitle title={i18n.t('contactUs.contactInformationTitle')} />
                    {settings.contactEmail ? (
                      <Card
                        icon={emailIcon}
                        onIconPress={() => {
                          if (settings.contactEmail) {
                            Linking.openURL(`mailto:${settings.contactEmail}`);
                          }
                        }}
                        title={i18n.t('onboarding.emailPlaceholder')}
                      >
                        <Text>{settings.contactEmail}</Text>
                      </Card>
                    ) : null}
                    {settings.contactPhone ? (
                      <Card
                        icon={phoneIcon}
                        onIconPress={e => (settings.contactPhone ? ActionMenu(e, settings.contactPhone) : undefined)}
                        title={i18n.t('onboarding.phonePlaceholder')}
                      >
                        <Text>{settings.contactPhone}</Text>
                      </Card>
                    ) : null}
                    {settings.contactUsUrl ? (
                      <NoTitleCard onPress={() => openContactUs()}>
                        <LearnMoreButton onPress={() => openContactUs()}>
                          <LearnMoreText>{settings.contactUsText || i18n.t('contactUs.learnMore')}</LearnMoreText>
                          <LearnMoreIcon Svg={arrowBack} fill="#24aaf2" />
                        </LearnMoreButton>
                      </NoTitleCard>
                    ) : null}
                  </CardsContainer>
                ) : null}
                <CardsContainer>
                  <CardsTitle title={i18n.t('contactUs.legalTitle')} />
                  <NoTitleCard testID="privacyPolicy" showArrow onPress={() => openPrivacy()}>
                    <Text>
                      {i18n.t('contactUs.privacyPolicy')}
                    </Text>
                  </NoTitleCard>
                  <NoTitleCard testID="termsOfUse" showArrow onPress={() => openTerms()}>
                    <Text>{i18n.t('contactUs.termsOfUse')}</Text>
                  </NoTitleCard>
                </CardsContainer>
              </Container>
            </ScrollView>
          </ContactUsPageView>
        </>
      ) : (
        <WebView
          {...webViewWindow}
          onIconPress={() => setWebViewWindow(null)}
        />
      )}
    </PageContainer>
  );
};
