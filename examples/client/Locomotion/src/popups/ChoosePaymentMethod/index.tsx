import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
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
  showCash: boolean
}

type Nav = {
  navigate: (value: string) => void;
}

const PaymentMethodPopup = ({
  isVisible, onCancel, onSubmit, showCash,
}: PaymentMethodPopupProps) => {
  const {
    ride,
  } = useContext(RidePageContext);
  const usePayments = PaymentsContext.useContainer();
  const [paymentId, setPaymentId] = useState(usePayments.getClientDefaultMethod()?.id);
  const navigation = useNavigation<Nav>();

  const onSave = () => {
    onSubmit(paymentId);
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
            {(isCashEnabled && showCash
              ? [...usePayments.paymentMethods, cashPaymentMethod]
              : usePayments.paymentMethods).map((paymentMethod: any, i) => (
                <PaymentMethod
                  {...paymentMethod}
                  selected={paymentId === paymentMethod.id}
                  mark={paymentId === paymentMethod.id}
                  onPress={() => {
                    setPaymentId(paymentMethod.id);
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

PaymentMethodPopup.propTypes = {
  onSave: PropTypes.func,
  showCash: PropTypes.bool,
};

PaymentMethodPopup.defaultProps = {
  onSave: null,
  showCash: true,
};

export default PaymentMethodPopup;
