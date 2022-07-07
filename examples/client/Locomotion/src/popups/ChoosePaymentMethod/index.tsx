import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../I18n';
import { MAIN_ROUTES } from '../../pages/routes';
import {
  SummaryContainer,
  Title,
  Container,
  Footer,
} from './styled';
import RoundedButton from '../../Components/RoundedButton';
import { FlexCont } from '../../Components/Flex';
import PaymentMethod from '../../Components/CardRow';
import PaymentsContext from '../../context/payments';
import { RidePageContext } from '../../context/newRideContext';
import cashPaymentMethod from '../../pages/Payments/cashPaymentMethod';

interface PaymentMethodPopupProps {
  isVisible: boolean;
  onCancel: () => void;
  onSubmit: (payment: string | undefined) => void;
}

type Nav = {
  navigate: (value: string) => void;
}

const PaymentMethodPopup = ({ isVisible, onCancel, onSubmit }: PaymentMethodPopupProps) => {
  const {
    ride,
  } = useContext(RidePageContext);
  const [payment, setPayment] = useState(ride?.paymentMethodId);
  const usePayments = PaymentsContext.useContainer();
  const navigation = useNavigation<Nav>();

  const onSave = () => {
    onSubmit(payment);
    onCancel();
  };

  const [isCashEnabled, setIsCashEnabled] = useState(false);

  useEffect(() => {
    const getIsCashEnabled = async () => {
      const result = await usePayments.isCashPaymentEnabled();
      setIsCashEnabled(result.value);
    };

    getIsCashEnabled();
  }, [usePayments]);

  return (
    <Modal isVisible={isVisible}>
      <SummaryContainer>
        <Container>
          <View>
            <Title>{i18n.t('popups.choosePaymentMethod.title')}</Title>
          </View>
          <View>
            {(isCashEnabled ? [...usePayments.paymentMethods, cashPaymentMethod] : usePayments.paymentMethods).map((paymentMethod: any, i) => (
              <PaymentMethod
                {...paymentMethod}
                selected={payment === paymentMethod.id}
                onPress={() => {
                  setPayment(paymentMethod.id);
                }}
              />
            ))}
            <PaymentMethod
              addNew
              onPress={() => {
                onCancel();
                navigation.navigate(MAIN_ROUTES.PAYMENT);
              }}
            />
          </View>
          <Footer>
            <FlexCont style={{ justifyContent: 'center' }}>
              <RoundedButton
                type="confirm"
                hollow={false}
                disabled={false}
                useCancelTextButton={false}
                setLoading={null}
                style={{}}
                onPress={() => onSave()}
              >
                {i18n.t('payments.select')}
              </RoundedButton>
            </FlexCont>
          </Footer>
        </Container>
      </SummaryContainer>
    </Modal>
  );
};

PaymentMethodPopup.defaultProps = {
  customOnSave: null,
};

export default PaymentMethodPopup;
