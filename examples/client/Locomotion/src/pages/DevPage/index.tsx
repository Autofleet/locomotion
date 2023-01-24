/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Config from 'react-native-config';
import AppSettings from '../../services/app-settings';
import Button from '../../Components/Button';
import { ButtonText } from '../../Components/TextButton';
import { BaseText } from '../../Components/BaseText';
import TextInput from '../../Components/TextInput';
import { PageContainer } from '../styles';
import PageHeader from '../../Components/PageHeader';
import i18n from '../../I18n';

import * as navigationService from '../../services/navigation';


const DevSettingPage = () => {
  const [operationId, setOperationId] = useState(Config.OPERATION_ID);
  const [serverHost, setServerHost] = useState(Config.SERVER_HOST);
  return (
    <PageContainer>
      <PageHeader
        title={i18n.t('devSettingsPage.pageTitle')}
        onIconPress={
          () => navigationService.goBack()}
      />
      <BaseText>Operation Id</BaseText>
      <TextInput
        testID="operationId"
        autoFocus
        onChangeText={(newOperationId : string) => {
          setOperationId(newOperationId);
        }}
        value={operationId}
      />
      <BaseText>Server Host</BaseText>
      <TextInput
        testID="serverHost"
        autoFocus
        onChangeText={(newServerHost: string) => {
          setServerHost(newServerHost);
        }}
        value={serverHost}
      />
      <Button
        testID="saveButton"
        onPress={() => {
          navigationService.goBack();
          AppSettings.setSettings({ serverHost, operationId });
        }}
      >
        <ButtonText>Save</ButtonText>
      </Button>

      <ScrollView />
    </PageContainer>

  );
};

export default DevSettingPage;
