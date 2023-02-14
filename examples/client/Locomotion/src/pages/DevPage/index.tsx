/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Config from 'react-native-config';
import TextInput from '../../Components/TextInput';
import { NavButton, ButtonText } from '../Profile/SaveButton/styles';
import AppSettings from '../../services/app-settings';
import { PageContainer } from '../styles';
import PageHeader from '../../Components/PageHeader';
import i18n from '../../I18n';

import * as navigationService from '../../services/navigation';
import { InputContainer, Label } from './styles';


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
      <Label>Operation Id</Label>
      <InputContainer>
        <TextInput
          testID="operationId"
          autoFocus
          onChangeText={(newOperationId : string) => {
            setOperationId(newOperationId);
          }}
          value={operationId}
        />
      </InputContainer>
      <Label>Server Host</Label>
      <TextInput
        testID="serverHost"
        autoFocus
        onChangeText={(newServerHost: string) => {
          setServerHost(newServerHost);
        }}
        value={serverHost}
      />
      <NavButton
        testID="saveButton"
        onPress={() => {
          navigationService.goBack();
          AppSettings.setSettings({ serverHost, operationId });
        }}
      >
        <ButtonText>Save</ButtonText>
      </NavButton>

      <ScrollView />
    </PageContainer>

  );
};

export default DevSettingPage;
