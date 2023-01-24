/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Config from 'react-native-config';
import { BaseText } from '../../Components/BaseText';
import TextInput from '../../Components/TextInput';
import { PageContainer } from '../styles';
import PageHeader from '../../Components/PageHeader';
import i18n from '../../I18n';

import * as navigationService from '../../services/navigation';


const DevSettingPage = () => {
  const [operationId, setOperationId] = useState(Config.OPERATION_ID);
  const [clientGatewayIp, setClientGatewayIp] = useState(Config.SERVER_HOST);
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
        onChangeText={(c: string) => {
          setOperationId(c);
        }}
        value={operationId}
        autoCapitalize="none"
      />

      <ScrollView />
    </PageContainer>
  );
};

export default DevSettingPage;
