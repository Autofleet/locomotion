import React, { useState, useContext, useRef } from 'react';
import { ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MAIN_ROUTES } from '../routes';
import PaymentsContext from '../../context/payments';
import TextInput from '../../Components/TextInput';
import {
  ErrorText, PageContainer, SafeView, InputContainer,
} from '../Profile/styles';
import i18n from '../../I18n';
import Header from '../Profile/Header';
import ScreenText from '../Profile/ScreenText';
import SaveButton from '../Profile/SaveButton';

type Params = {
  name: string,
  id: string
}

type Route = {
  params?: Readonly<object | undefined> | Params
}


const EditCardName = ({ navigation } : any) => {
  const route : Route = useRoute();
  const usePayments = PaymentsContext.useContainer();
  const [nickname, setNickname] = useState((route.params as Params).name);
  const [showErrorText, setShowErrorText] = useState(false);

  const onComplete = async () => {
    await usePayments.updatePaymentMethod((route.params as Params).id, { name: nickname });
    await usePayments.loadCustomer();
    navigation.navigate(MAIN_ROUTES.PAYMENT);
  };

  return (
    <SafeView>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Header title={i18n.t('onboarding.pages.name.title')} showSkipButton={false} />
        <PageContainer>
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
        </PageContainer>
      </ScrollView>
    </SafeView>
  );
};

export default EditCardName;
