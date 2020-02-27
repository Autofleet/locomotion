import React, { Fragment,useState,useEffect } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import Config from 'react-native-config';
import i18n from '../../I18n';
import Header from '../../Components/Header';
import PageHeader from "../../Components/PageHeader";
import network from '../../services/network'
const { CONTACT_US_URL: uri } = Config;


export default ({ navigation }) => {
  const [settings, setSettings] = useState({
    termsUrl: null,
    privacyUrl: null,
    contactUsUrl: null
  })

  const loadSettings = async () => {
    console.log('LOADINGG');

    const {data: settings} = await network.get('/api/v1/login/settings');
    setSettings(settings);
    console.log(settings);

  }

  useEffect(() => {
    loadSettings();
  })

  return (<Fragment>
    <PageHeader
        title={i18n.t('contactUs.pageTitle')}
        onIconPress={()=>navigation.toggleDrawer()}
    />
    { uri ? <WebView
      source={{ uri:settings.contactUsUrl }}
      style={{ marginTop: 40 }}
    /> : null}
  </Fragment>);
};
