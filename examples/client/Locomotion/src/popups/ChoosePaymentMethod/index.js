import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../I18n';
import { MAIN_ROUTES } from '../../pages/routes';
import {
  SummaryContainer,
  Title,
  StyledTextArea,
  Counter,
} from './styled';
import RoundedButton from '../../Components/RoundedButton';
import { FlexCont } from '../../Components/Flex';
import PaymentMethod from '../../Components/CardRow';
import PaymentsContext from '../../context/payments';

const MAX_SIZE = 100;

export default ({ isVisible, setIsVisible }) => {
  const [selectedCreditCardId, setSelectedCreditCardId] = useState();
  const usePayments = PaymentsContext.useContainer();
  const navigation = useNavigation();
  const onSubmit = async () => {
  };

  console.log({isVisible})
  return (
    <Modal isVisible={isVisible}>
      <SummaryContainer>
        <View style={{ flex: 1, textAlign: 'left', width: '100%' }}>
          <FlexCont justifyContent="space-between">
            <View>
              <Title>{i18n.t('popups.choosePaymentMethod.title')}</Title>
            </View>
          </FlexCont>
          <View>
            {[...usePayments.paymentMethods].map((paymentMethod, i) =>
              <PaymentMethod {...paymentMethod} selected={selectedCreditCardId === paymentMethod.id} onPress={() => setSelectedCreditCardId(paymentMethod.id)}/>)}
            <PaymentMethod addNew onPress={() => { setIsVisible(false); navigation.navigate(MAIN_ROUTES.PAYMENT); }} />
          </View>
          <FlexCont style={{ justifyContent: 'center'}}>
            <RoundedButton
              style={{width: '90%' }}
              data-test-id="SubmitRideSummaryPopupButton2"
              onPress={() => onSubmit()}
            >
              {i18n.t('popups.rideNotes.save')}
            </RoundedButton>
          </FlexCont>
        </View>
      </SummaryContainer>
    </Modal>
  );
};

// 