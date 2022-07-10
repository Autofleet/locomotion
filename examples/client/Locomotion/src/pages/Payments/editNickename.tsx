import React, { useState, useContext, useRef } from 'react';
import { ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import PaymentsContext from '../../context/payments';
import TextInput from '../../Components/TextInput';
import {
  ErrorText, PageContainer, SafeView, InputContainer,
} from '../Profile/styles';
import i18n from '../../I18n';
import Header from '../Profile/Header';
import ScreenText from '../Profile/ScreenText';
import SaveButton from '../Profile/SaveButton';

const EditCardName = ({ navigation }) => {
  const route = useRoute();
  const usePayments = PaymentsContext.useContainer();
  const [nickname, setNickname] = useState(route.params?.name);
  const [showErrorText, setShowErrorText] = useState(false);

  const onComplete = async () => {
    await usePayments.updatePaymentMethod(route.params?.id, { name: nickname });
  };

  return (
    <SafeView>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Header title={i18n.t('onboarding.pages.name.title')} page={undefined} showSkipButton={false} />
        <PageContainer>
          <ScreenText
            text={i18n.t('Set Card Nickname')}
          />
          <InputContainer>
            <TextInput
              placeholder="Name"
              autoFocus
              onChangeText={v => setNickname(v)}
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
