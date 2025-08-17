/* eslint-disable no-unused-expressions */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import EmptyState from '../../Components/EmptyState';
import Mixpanel from '../../services/Mixpanel';
import { PAYMENT_MODES, PAYMENT_TABS } from '../../pages/Payments/consts';
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
import externalPaymentMethod from '../../pages/Payments/externalPaymentMethod';

import * as navigationService from '../../services/navigation';
import { NewRidePageContext } from '../../context';

interface PaymentMethodPopupProps {
  isVisible: boolean;
  onCancel: () => void;
  onSubmit: (payment: any) => void;
  showCash: boolean;
  rideFlow: boolean;
  selected: any;
  onAddNewMethod: () => void;
  showOffline: boolean;
  showExternal: boolean;
  showBusinessPaymentMethods: boolean;
  selectedBusinessAccountId: string | null;
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
  showExternal,
  showBusinessPaymentMethods,
  selectedBusinessAccountId,
}: PaymentMethodPopupProps) => {
  const usePayments = PaymentsContext.useContainer();
  const { chosenService } = useContext(NewRidePageContext);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | undefined>(selected);
  const [activePaymentTab, setActivePaymentTab] = useState(
    selectedBusinessAccountId ? PAYMENT_MODES.BUSINESS : PAYMENT_MODES.PERSONAL,
  );
  const isBusinessMode = activePaymentTab === PAYMENT_MODES.BUSINESS;

  const personalPaymentMethods = [
    ...usePayments.paymentMethods,
    ...(showCash ? [cashPaymentMethod] : []),
    ...(showOffline ? [offlinePaymentMethod] : []),
    ...(showExternal ? [externalPaymentMethod] : []),
  ];

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
    usePayments.loadCustomer();
  }, []);

  useEffect(() => {
    if (!usePayments.businessPaymentMethods?.length
      && activePaymentTab === PAYMENT_MODES.BUSINESS) {
      setActivePaymentTab(PAYMENT_MODES.PERSONAL);
    }
  }, [usePayments.businessPaymentMethods]);

  useEffect(() => {
    if (!isVisible) {
      setActivePaymentTab(
        selectedBusinessAccountId ? PAYMENT_MODES.BUSINESS : PAYMENT_MODES.PERSONAL,
      );
    }
  }, [isVisible]);

  useEffect(() => {
    const updateDefaultPaymentMethod = async () => {
      if (selected) {
        if (selected === offlinePaymentMethod.id && selectedBusinessAccountId) {
          setSelectedPaymentId(selectedBusinessAccountId);
        } else {
          setSelectedPaymentId(selected);
        }
      } else {
        const paymentMethod = await usePayments.getClientDefaultMethod();
        if (paymentMethod?.id) {
          setSelectedPaymentId(paymentMethod?.id);
        } else if (selectedBusinessAccountId) {
          setSelectedPaymentId(selectedBusinessAccountId);
        }
      }
    };


    updateDefaultPaymentMethod();
  }, [usePayments.paymentMethods, selected, chosenService]);

  const onSave = () => {
    const businessPaymentSelected = showBusinessPaymentMethods
      && usePayments.businessPaymentMethods.some(
        (paymentMethod: any) => paymentMethod.id === selectedPaymentId,
      );
    if (businessPaymentSelected) {
      onSubmit({
        id: selectedPaymentId,
        isBusiness: true,
      });
    } else {
      onSubmit(selectedPaymentId);
    }
    onCancel();
  };
  const renderPersonalPaymentMethods = () => (
    personalPaymentMethods.length > 0
      ? (personalPaymentMethods.map((paymentMethod: any) => {
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
      ) : (
        <EmptyState
          title={i18n.t('popups.choosePaymentMethod.emptyStateText')}
        />
      )
  );


  return (
    <Modal
      isVisible={isVisible}
    >
      <SummaryContainer>
        <TitleView>
          <Title>{i18n.t('popups.choosePaymentMethod.title')}</Title>
          <CloseButton onPress={async () => {
            onCancel();
            rideFlow
              ? navigationService.navigate(MAIN_ROUTES.HOME)
              : navigationService.navigate(MAIN_ROUTES.PAYMENT);
          }}
          />
        </TitleView>

        <Container>
          { showBusinessPaymentMethods && (
            <TabSwitch
              activeTabId={activePaymentTab}
              tabs={PAYMENT_TABS}
              onUnselectedClick={(tab) => {
                setActivePaymentTab(tab.id);
                Mixpanel.setEvent('change payment mode personal / business', { mode: tab.id });
              }}
            />
          ) }
          <CardsScrollView>
            {isBusinessMode ? (
              usePayments.businessPaymentMethods.map((paymentMethod: any) => (
                <PaymentMethod
                  testIdPrefix="Dialog"
                  noSvg
                  alignMarkToRight
                  noNotCapitalizeName
                  {...paymentMethod}
                  chooseMethodPage
                  selected={selectedPaymentId === paymentMethod.id}
                  mark={selectedPaymentId === paymentMethod.id}
                  onPress={() => {
                    Mixpanel.setEvent('select business payment method', { method: paymentMethod.id });
                    setSelectedPaymentId(paymentMethod.id);
                  }}
                />
              ))
            ) : renderPersonalPaymentMethods()}
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
          </CardsScrollView>
        </Container>
        <Footer>
          <FlexCont style={{ justifyContent: 'center' }}>
            <SelectButton
              disabled={!selectedPaymentId}
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
  showExternal: PropTypes.bool,
};

PaymentMethodPopup.defaultProps = {
  onSave: null,
  showCash: true,
  rideFlow: false,
  selected: null,
  showOffline: false,
  showExternal: false,
};

export default PaymentMethodPopup;
