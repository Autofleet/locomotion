import React, { Fragment } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import Config from 'react-native-config';
import i18n from '../../I18n';
import Header from '../../Components/Header';
import PageHeader from "../../Components/PageHeader";
const closeIconSource = require('../../assets/x.png');

export default ({ navigation, uri, title, onIconPress  }) => {
  return (<Fragment>
    <PageHeader
        title={title}
        onIconPress={onIconPress}
        iconSide="right"
        icon={closeIconSource}
    />
    { uri ? <WebView
      source={{ uri }}
      style={{ marginTop: 0 }}
    /> : null}
  </Fragment>);
};
