import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
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
  const [stripeKey, setStripeKey] = useState(Config.STRIPE_PUBLISHER_KEY);
  return (
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
      <Label>Stripe Key</Label>
      <TextInput
        testID="stripeKey"
        autoFocus
        onChangeText={(newStripeKey: string) => {
          setStripeKey(newStripeKey);
        }}
        value={stripeKey}
      />
      <NavButton
        testID="saveButton"
        onPress={() => {
          AppSettings.setSettings({ serverUrl, operationId, stripeKey });
          navigationService.goBack();
        }}
      >
        <ButtonText>Save</ButtonText>
      </NavButton>

      <ScrollView />
    </PageContainer>

  );
};

export default DevSettingPage;
