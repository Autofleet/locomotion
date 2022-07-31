/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import SvgIcon from '../../Components/SvgIcon';
import i18n from '../../I18n';
import { MAIN_ROUTES } from '../../pages/routes';
import {
  SummaryContainer,
  Title,
  Container,
  Footer,
  TitleView,
  CloseButton,
  CardsScrollView,
  SelectButton,
} from './styled';
import { FlexCont } from '../../Components/Flex';
import PaymentMethod from '../../Components/CardRow';
import PaymentsContext from '../../context/payments';
import cashPaymentMethod from '../../pages/Payments/cashPaymentMethod';
import closeXIcon from '../../assets/close-x.svg';

interface PaymentMethodPopupProps {
  isVisible: boolean;
  onCancel: () => void;
  onSubmit: (payment: string | undefined) => void;
  showCash: boolean;
  rideFlow: boolean;
  selected: any;
}

type Nav = {
  navigate: (value: string, params?: any) => void;
}

const PaymentMethodPopup = ({
  isVisible, onCancel, onSubmit, showCash, rideFlow, selected,
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

  const navigation = useNavigation<Nav>();

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

  return (
    <Modal
      isVisible={isVisible}
    >
      <SummaryContainer>
        <TitleView>
          <Title>{i18n.t('popups.choosePaymentMethod.title')}</Title>
          <CloseButton
            noBackground
            onPress={async () => {
              onCancel();
              setSelectedPaymentId(selected
                || (await usePayments.getClientDefaultMethod())?.id);
              rideFlow
                ? navigation.navigate(MAIN_ROUTES.HOME)
                : navigation.navigate(MAIN_ROUTES.PAYMENT);
            }}
          >
            <SvgIcon
              Svg={closeXIcon}
              width={11}
              height={11}
              fill="#333"
            />
          </CloseButton>
        </TitleView>
        <CardsScrollView>
          <Container>
            <View>
              {(isCashEnabled && showCash
                ? [...usePayments.paymentMethods, cashPaymentMethod]
                : usePayments.paymentMethods).map((paymentMethod: any, i) => (
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
              <PaymentMethod
                addNew
                chooseMethodPage
                onPress={() => {
                  onCancel();
                  setTimeout(() => {
                    navigation.navigate(MAIN_ROUTES.PAYMENT, { showAdd: true, rideFlow });
                  }, 500);
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
