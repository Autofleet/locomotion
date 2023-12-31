/* eslint-disable no-unused-expressions */
import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { INITIAL_ACTIVE_PAYMENT_TAB, PAYMENT_MODES, PAYMENT_TABS } from '../../pages/Payments/consts';
import TabSwitch from '../../Components/TabSwitch';
import { getPaymentMethod } from '../../pages/Payments/cardDetailUtils';
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
import offlinePaymentMethod from '../../pages/Payments/offlinePaymentMethod';
import * as navigationService from '../../services/navigation';
import { MewRidePageContext } from '../../context';

interface PaymentMethodPopupProps {
  isVisible: boolean;
  onCancel: () => void;
  onSubmit: (payment: string | undefined) => void;
  showCash: boolean;
  rideFlow: boolean;
  selected: any;
  onAddNewMethod: () => void;
  showOffline: boolean;
}

const PaymentMethodPopup = ({
  isVisible,
  onCancel,
  onSubmit,
  showCash,
  rideFlow,
  selected,
  onAddNewMethod,
  showOffline,
}: PaymentMethodPopupProps) => {
  const usePayments: any = PaymentsContext.useContainer();
  const { chosenService } = useContext(MewRidePageContext);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | undefined>(selected);
  const [activePaymentTab, setActivePaymentTab] = useState(INITIAL_ACTIVE_PAYMENT_TAB);
  const isBusinessMode = activePaymentTab === PAYMENT_MODES.BUSINESS;
  const getDisabledReason = (paymentMethod: any) => {
    if (
      chosenService
      && !chosenService.allowedPaymentMethods.includes(getPaymentMethod(paymentMethod.id))
    ) {
      return i18n.t('popups.choosePaymentMethod.unavailable');
    }
    return null;
  };

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
  }, [usePayments.paymentMethods, selected, chosenService]);

  const onSave = (id?: string) => {
    onSubmit(id || selectedPaymentId);
    onCancel();
  };

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
            <TabSwitch
              activeTabId={activePaymentTab}
              tabs={PAYMENT_TABS}
              onUnselectedClick={(tab) => {
                setActivePaymentTab(tab.id);
              }}
            />
            <View>
              {
                (
                  [
                    ...usePayments.paymentMethods,
                    ...(showCash ? [cashPaymentMethod] : []),
                    ...(showOffline ? [offlinePaymentMethod] : []),
                  ].map((paymentMethod: any) => {
                    const reason = getDisabledReason(paymentMethod);
                    return (
                      <PaymentMethod
                        testIdPrefix="Dialog"
                        {...paymentMethod}
                        chooseMethodPage
                        disabledReason={reason}
                        selected={selectedPaymentId === paymentMethod.id}
                        mark={selectedPaymentId === paymentMethod.id}
                        onPress={() => {
                          setSelectedPaymentId(paymentMethod.id);
                        }}
                      />
                    );
                  })
                  )
              }
              { !isBusinessMode && (
              <PaymentMethod
                testIdPrefix="Dialog"
                addNew
                chooseMethodPage
                onPress={() => {
                  onAddNewMethod();
                }}
              />
              ) }
            </View>
          </Container>
        </CardsScrollView>
        <Footer>
          <FlexCont style={{ justifyContent: 'center' }}>
            <SelectButton
              testID="selectCard"
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
  showOffline: PropTypes.bool,
};

PaymentMethodPopup.defaultProps = {
  onSave: null,
  showCash: true,
  rideFlow: false,
  selected: null,
  showOffline: false,
};

export default PaymentMethodPopup;
