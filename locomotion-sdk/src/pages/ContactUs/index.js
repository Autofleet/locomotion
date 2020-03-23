import React, { Fragment, useState, useEffect } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import Config from 'react-native-config';
import i18n from '../../I18n';
import Header from '../../Components/Header';
import PageHeader from '../../Components/PageHeader';
import network from '../../services/network';

const { CONTACT_US_URL: uri } = Config;


export default ({ navigation, menuSide }) => {
  const [settings, setSettings] = useState({
    termsUrl: null,
    privacyUrl: null,
    contactUsUrl: null,
  });

  const loadSettings = async () => {
    const { data: settingsData } = await network.get('/api/v1/login/settings');
    setSettings(settingsData);
  };

  useEffect(() => {
    loadSettings();
  });

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
        />
      ) : null}
    </Fragment>
  );
};
