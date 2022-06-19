import React from 'react';
import { useRoute } from '@react-navigation/native';
import { MAIN_ROUTES } from '../routes';
import WebView from '../WebView';
import SafeView from '../../Components/SafeView';

export default ({ navigation }) => {
  const route = useRoute();
  const {
    url,
    title,
  } = (route.params || {
    url: '',
    title: '',
  });
  return (
    <SafeView style={{ height: '100%', width: '100%' }}>
      <WebView
        title={title}
        uri={url}
        onIconPress={() => navigation.navigate(MAIN_ROUTES.HOME)}
      />
    </SafeView>
  );
};
