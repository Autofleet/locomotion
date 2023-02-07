/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import CloseButton from '../../Components/CloseButton';
import i18n from '../../I18n';
import { MAIN_ROUTES } from '../../pages/routes';
import {
  SummaryContainer,
  Title,
  Container,
  Footer,
  TitleView,
  CardsScrollView,
  SelectButton,
} from './styled';
import { FlexCont } from '../../Components/Flex';
import PaymentMethod from '../../Components/CardRow';
import PaymentsContext from '../../context/payments';
import cashPaymentMethod from '../../pages/Payments/cashPaymentMethod';
import * as navigationService from '../../services/navigation';
import NativePay from '../../Components/NativePay';

interface PaymentMethodPopupProps {
  isVisible: boolean;
  onCancel: () => void;
  onSubmit: (payment: string | undefined) => void;
  showCash: boolean;
  rideFlow: boolean;
  selected: any;
  onAddNewMethod: () => void;
  showNativePay?: boolean;
}

const PaymentMethodPopup = ({
  isVisible, onCancel, onSubmit, showCash, rideFlow, selected, onAddNewMethod,
}: PaymentMethodPopupProps) => {
  const usePayments = PaymentsContext.useContainer();
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | undefined>(selected);

  useEffect(() => {
    usePayments.getOrFetchCustomer();
  }, []);


  useEffect(() => {
    const updateDefaultPaymentMethod = async () => {
      if (selected) {
        setSelectedPaymentId(selected);
      } else {
        const paymentMethod = await usePayments.getClientDefaultMethod();
        setSelectedPaymentId(paymentMethod?.id);
      }
    };


    updateDefaultPaymentMethod();
  }, [usePayments.paymentMethods, selected]);

  const onSave = () => {
    onSubmit(selectedPaymentId);
    onCancel();
  };

  const [isCashEnabled, setIsCashEnabled] = useState(false);

  useEffect(() => {
    const getIsCashEnabled = async () => {
      const result = await usePayments.isCashPaymentEnabled();

      setIsCashEnabled(result);
    };

    getIsCashEnabled();
  }, [usePayments.paymentMethods]);


  const finalPaymentMethods = (isCashEnabled && showCash
    ? [...usePayments.paymentMethods, cashPaymentMethod]
    : usePayments.paymentMethods);

  return (
    <Modal
      isVisible={isVisible}
    >
      <SummaryContainer>
        <TitleView>
          <Title>{i18n.t('popups.choosePaymentMethod.title')}</Title>
          <CloseButton onPress={async () => {
            onCancel();
            setSelectedPaymentId(selected
                || (await usePayments.getClientDefaultMethod())?.id);
            rideFlow
              ? navigationService.navigate(MAIN_ROUTES.HOME)
              : navigationService.navigate(MAIN_ROUTES.PAYMENT);
          }}
          />
        </TitleView>
        <CardsScrollView>
          <Container>
            <View>
              {finalPaymentMethods.map((paymentMethod: any) => (
                <PaymentMethod
                  {...paymentMethod}
                  chooseMethodPage
                  selected={selectedPaymentId === paymentMethod.id}
                  mark={selectedPaymentId === paymentMethod.id}
                  onPress={() => {
                    setSelectedPaymentId(paymentMethod.id);
                  }}
                />
              ))}
              <NativePay />
              <PaymentMethod
                addNew
                chooseMethodPage
                onPress={() => {
                  onAddNewMethod();
                }}
              />
            </View>
          </Container>
        </CardsScrollView>
        <Footer>
          <FlexCont style={{ justifyContent: 'center' }}>
            <SelectButton
              type="confirm"
              onPress={() => {
                onSave();
              }}
            >
              {i18n.t('payments.select')}
            </SelectButton>
          </FlexCont>
        </Footer>
      </SummaryContainer>
    </Modal>
  );
};

PaymentMethodPopup.propTypes = {
  onSave: PropTypes.func,
  showCash: PropTypes.bool,
  rideFlow: PropTypes.bool,
  selected: PropTypes.string,
};

PaymentMethodPopup.defaultProps = {
  onSave: null,
  showCash: true,
  rideFlow: false,
  selected: null,
};

export default PaymentMethodPopup;
