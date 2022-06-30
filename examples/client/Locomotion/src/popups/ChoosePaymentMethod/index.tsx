import React, { useContext } from 'react';
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
}

type Nav = {
  navigate: (value: string) => void;
}

const PaymentMethodPopup = ({ isVisible, onCancel }: PaymentMethodPopupProps) => {
  const {
    ride,
    updateRide,
  } = useContext(RidePageContext);
  const usePayments = PaymentsContext.useContainer();
  const navigation = useNavigation<Nav>();

  return (
    <Modal isVisible={isVisible}>
      <SummaryContainer>
        <Container>
          <View>
            <Title>{i18n.t('popups.choosePaymentMethod.title')}</Title>
          </View>
          <View>
            {[...usePayments.paymentMethods, cashPaymentMethod].map((paymentMethod: any, i) => (
              <PaymentMethod
                {...paymentMethod}
                selected={ride?.paymentMethodId === paymentMethod.id}
                onPress={() => {
                  updateRide({
                    paymentMethodId: paymentMethod.id,
                  });
                  onCancel();
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
                onPress={() => onCancel()}
              >
                {i18n.t('popups.rideNotes.save')}
              </RoundedButton>
            </FlexCont>
          </Footer>
        </Container>
      </SummaryContainer>
    </Modal>
  );
};

export default PaymentMethodPopup;
