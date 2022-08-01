import React, { useState, useContext, useRef } from 'react';
import { ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MAIN_ROUTES } from '../routes';
import PaymentsContext from '../../context/payments';
import TextInput from '../../Components/TextInput';
import {
  ErrorText, InputContainer,
} from '../Profile/styles';
import i18n from '../../I18n';
import Header from '../Profile/Header';
import ScreenText from '../Profile/ScreenText';
import SaveButton from '../Profile/SaveButton';
import { ContentContainer, PageContainer } from '../styles';
import * as navigationService from '../../services/navigation';

type Params = {
  name: string,
  id: string
}

type Route = {
  params?: Readonly<object | undefined> | Params
}


const EditCardName = () => {
  const route : Route = useRoute();
  const usePayments = PaymentsContext.useContainer();
  const [nickname, setNickname] = useState((route.params as Params).name);
  const [showErrorText, setShowErrorText] = useState(false);

  const onComplete = async () => {
    await usePayments.updatePaymentMethod((route.params as Params).id, { name: nickname });
    await usePayments.loadCustomer();
    navigationService.navigate(MAIN_ROUTES.PAYMENT);
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <PageContainer>
        <Header title={i18n.t('onboarding.pages.name.title')} showSkipButton={false} />
        <ContentContainer>
          <ScreenText
            text={i18n.t('payments.setCardName')}
            subText={undefined}
          />
          <InputContainer>
            <TextInput
              placeholder="Name"
              autoFocus
              onChangeText={(v : string) => setNickname(v)}
              value={nickname}
              autoCapitalize="words"
              error={nickname === ''}
              returnKeyType="next"
              fullBorder
            />
          </InputContainer>
          {showErrorText && <ErrorText>{i18n.t('onboarding.fullNameError')}</ErrorText>}
          <SaveButton
            isInvalid={nickname === ''}
            onFail={() => setShowErrorText(true)}
            onNext={onComplete}
            buttonText="Save"
            isLoading={undefined}
          />
        </ContentContainer>
      </PageContainer>
    </ScrollView>
  );
};

export default EditCardName;
