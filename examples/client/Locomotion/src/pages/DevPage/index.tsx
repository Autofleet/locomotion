import React, { useState } from 'react';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import Config from 'react-native-config';
import TextInput from '../../Components/TextInput';
import { NavButton, ButtonText } from '../Profile/SaveButton/styles';
import AppSettings from '../../services/app-settings';
import { PageContainer } from '../styles';
import PageHeader from '../../Components/PageHeader';

import * as navigationService from '../../services/navigation';
import { InputContainer, Label } from './styles';


const DevSettingPage = () => {
  const [operationId, setOperationId] = useState(Config.OPERATION_ID);
  const [serverUrl, setServerUrl] = useState(Config.SERVER_HOST);
  return (
    <GestureHandlerRootView>
      <PageContainer>
        <PageHeader
          title="Debug"
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
          testID="serverUrl"
          autoFocus
          onChangeText={(newServerUrl: string) => {
            setServerUrl(newServerUrl);
          }}
          value={serverUrl}
        />
        <NavButton
          testID="saveButton"
          onPress={() => {
            AppSettings.setSettings({ serverUrl, operationId });
            navigationService.goBack();
          }}
        >
          <ButtonText>Save</ButtonText>
        </NavButton>

        <ScrollView />
      </PageContainer>
    </GestureHandlerRootView>
  );
};

export default DevSettingPage;
