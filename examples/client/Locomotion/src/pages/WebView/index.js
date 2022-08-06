import React, { Fragment } from 'react';
import { WebView } from 'react-native-webview';
import PageHeader from '../../Components/PageHeader';

import closeIconSource from '../../assets/x.png';

export default ({
  navigation, uri, title, onIconPress, menuSide = 'right',
}) => (
  <>
    <PageHeader
      title={title}
      onIconPress={onIconPress}
      icon={closeIconSource}
      iconSide={menuSide}
    />
    { uri ? (
      <WebView
        overScrollMode="never"
        opacity={0.99}
        source={{ uri }}
        style={{ marginTop: 0 }}
        useWebKit
      />
    ) : null}
  </>
);
