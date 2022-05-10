import React, { Fragment, useState, useEffect } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import Config from 'react-native-config';
import i18n from '../../I18n';
import Header from '../../Components/Header';
import PageHeader from '../../Components/PageHeader';
import Mixpanel from '../../services/Mixpanel';
import { getLoginSettings } from '../../context/user/api';

const { CONTACT_US_URL: uri } = Config;


export default ({ navigation, menuSide }) => {
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
    Mixpanel.pageView(navigation.state.routeName)
    loadSettings();
  }, []);

  return (
    <Fragment>
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
    </Fragment>
  );
};
