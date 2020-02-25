import React, { Fragment } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import Config from 'react-native-config';
import i18n from '../../I18n';
import Header from '../../Components/Header';
import PageHeader from "../../Components/PageHeader";
const { CONTACT_US_URL: uri } = Config;

export default ({ navigation }) => {
  return (<Fragment>
    <PageHeader
        title={i18n.t('contactUs.pageTitle')}
        onIconPress={()=>navigation.toggleDrawer()}
    />
    { uri ? <WebView
      source={{ uri }}
      style={{ marginTop: 40 }}
    /> : null}
  </Fragment>);
};
