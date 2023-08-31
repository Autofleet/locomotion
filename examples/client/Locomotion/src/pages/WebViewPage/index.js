import React from 'react';
import { useRoute } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MAIN_ROUTES } from '../routes';
import WebView from '../WebView';
import SafeView from '../../Components/SafeView';
import * as navigationService from '../../services/navigation';

export default () => {
  const route = useRoute();
  const {
    url,
    title,
  } = (route.params || {
    url: '',
    title: '',
  });
  return (
    <GestureHandlerRootView>
      <SafeView style={{ height: '100%', width: '100%' }}>
        <WebView
          title={title}
          uri={url}
          onIconPress={() => navigationService.navigate(MAIN_ROUTES.HOME)}
        />
      </SafeView>
    </GestureHandlerRootView>
  );
};
