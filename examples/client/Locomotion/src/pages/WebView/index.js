import React, { Fragment } from 'react';
import { WebView } from 'react-native-webview';
import PageHeader from '../../Components/PageHeader';

const closeIconSource = require('../../assets/x.png');

export default ({
  navigation, uri, title, onIconPress, menuSide = 'right',
}) => (
  <Fragment>
    <PageHeader
      title={title}
      onIconPress={onIconPress}
      icon={closeIconSource}
      iconSide={menuSide}
    />
    { uri ? (
      <WebView
        source={{ uri }}
        style={{ marginTop: 0 }}
        useWebKit
      />
    ) : null}
  </Fragment>
);
