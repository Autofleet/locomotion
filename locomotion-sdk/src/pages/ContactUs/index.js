import React, { Fragment, useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import Config from 'react-native-config';
import i18n from '../../I18n';
import SafeView from '../../Components/SafeView';
import PageHeader from '../../Components/PageHeader';
import Mixpanel from '../../services/Mixpanel';
import { getLoginSettings } from '../../context/user/api';
import { PageContainer } from '../styles';

const { CONTACT_US_URL: uri } = Config;


export default ({ navigation, menuSide }) => {
  const route = useRoute()
  const [settings, setSettings] = useState({
    termsUrl: null,
    privacyUrl: null,
    contactUsUrl: null,
  });
  const loadSettings = async () => {
    const settingsData = await getLoginSettings()
    setSettings(settingsData);
  };

  useEffect(() => {
    Mixpanel.pageView(route.name)
    loadSettings();
  }, []);

  return (
    <PageContainer>
      <SafeView style={{height: '100%', width: '100%'}}>
        <PageHeader
          title={i18n.t('contactUs.pageTitle')}
          onIconPress={() => navigation.toggleDrawer()}
          iconSide={menuSide}
        />
        { uri ? (
          <WebView
            source={{ uri: settings.contactUsUrl }}
            style={{ marginTop: 40 }}
            useWebKit={true}
          />
        ) : null}
      </SafeView>
    </PageContainer>
  );
};
