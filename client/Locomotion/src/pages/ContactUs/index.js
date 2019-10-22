import React, { Fragment } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import Config from 'react-native-config';

import Header from '../../Components/Header';
const { CONTACT_US_URL: uri } = Config;

export default ({ navigation }) => {
  return (<Fragment>
    <Header navigation={navigation} />
    { uri ? <WebView
      source={{ uri }}
      style={{ marginTop: 40 }}
    /> : null}
  </Fragment>);
};