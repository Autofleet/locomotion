import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import {
  Modal, Platform, Text, View,
} from 'react-native';
import GenericErrorPopup from '../../popups/GenericError';
import { getCurrencySymbol } from '../../context/newRideContext/utils';
import ConfirmationPopup from '../../popups/ConfirmationPopup';
import { getLastFourForamttedLong } from '../../pages/Payments/cardDetailUtils';
import { MAIN_ROUTES } from '../../pages/routes';
import Card from '../InformationCard';
import {
  CardsContainer,
  CardsTitle,
  Container,
  LogoutContainer as DeletePaymentContainer,
} from '../../pages/Account/styled';
import i18n from '../../I18n';
import PageHeader from '../PageHeader';
import { PaymentMethodInterface } from '../../context/payments/interface';
import PaymentsContext from '../../context/payments';
import deleteIcon from '../../assets/delete.svg';
import { DeleteContainer, DeleteIcon, DeleteText } from './styled';
import { PageContainer } from '../../pages/styles';

type CardDetailsRouteParams = {
  paymentMethod: PaymentMethodInterface
};


const CardDetails = ({
  loadingState = false,
  navigation = { navigate: (route: string, object?: any | undefined) => null },
}) => {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [methodForDelete, setMethodForDelete] = useState(null);
  const [isCancelPopupVisible, setIsCancelPopupVisible] = useState(false);
  const usePayments = PaymentsContext.useContainer();
  const route = useRoute();

  const onRemoveMethod = async (methodId : any) => {
    setIsCancelPopupVisible(true);
    setMethodForDelete(methodId);
  };

  const detachCard = async () => {
    setLoading(true);
    try {
      await usePayments.detachPaymentMethod(methodForDelete);
      await usePayments.loadCustomer();
      setLoading(false);
      setIsCancelPopupVisible(false);
      navigation.navigate(MAIN_ROUTES.PAYMENT);
    } catch (e) {
      setIsCancelPopupVisible(false);
      setTimeout(() => setShowError(true), Platform.OS === 'ios' ? 500 : 0);
    }
  };

  const loadCustomer = async () => {
    setLoading(true);
    // loadCustomer to have current card balance
    await usePayments.loadCustomer();
    setLoading(false);
  };

  useEffect(() => {
    loadCustomer();
  }, []);

  useEffect(() => {
    setLoading(loadingState);
  }, [loading]);

  const params : CardDetailsRouteParams = route.params as CardDetailsRouteParams;
  const { paymentMethod } = params;

  return (
    <PageContainer>
      <KeyboardAwareScrollView extraScrollHeight={20} enableOnAndroid>
        <PageHeader
          title={i18n.t('payments.cardDetails.title')}
          onIconPress={() => navigation.navigate(MAIN_ROUTES.PAYMENT)}
        />
        <>
          <Container>
            <CardsContainer>
              <CardsTitle>
                {i18n.t('payments.cardDetails.cardsTitle')}
              </CardsTitle>
              {paymentMethod && paymentMethod.name
                ? (
                  <Card
                    title={i18n.t('payments.cardDetails.nickname')}
                  >
                    {paymentMethod.name}
                  </Card>
                )
                : undefined}
              <Card
                title={i18n.t('payments.cardDetails.number')}
              >
                {getLastFourForamttedLong(paymentMethod?.lastFour)}

              </Card>
              <Card
                title={i18n.t('payments.cardDetails.expiryDate')}
              >
                {moment(paymentMethod?.expiresAt).format('MM/YY')}

              </Card>
              {paymentMethod?.hasOutstandingBalance ? (
                <Card
                  title={i18n.t('payments.cardDetails.balance')}
                >
                  {`${i18n.t('payments.cardDetails.outstandingBalanceText')} ${paymentMethod.outstandingBalance.amount}${getCurrencySymbol(paymentMethod.outstandingBalance.currency)}`}
                </Card>
              ) : undefined}

              <DeletePaymentContainer
                disabled={paymentMethod?.hasOutstandingBalance}
                onPress={async () => {
                  await onRemoveMethod(paymentMethod?.id);
                }}
              >
                <DeleteContainer>
                  <DeleteIcon Svg={deleteIcon} fill={paymentMethod?.hasOutstandingBalance ? '#bcbcbc' : '#f35657'} />
                  <DeleteText hasOutstansingBalance={paymentMethod?.hasOutstandingBalance}>
                    {i18n.t('payments.cardDetails.deleteText')}
                  </DeleteText>
                </DeleteContainer>
              </DeletePaymentContainer>
            </CardsContainer>
          </Container>
          <ConfirmationPopup
            isVisible={isCancelPopupVisible}
            title={i18n.t('payments.popups.removeCard.title')}
            text={i18n.t('payments.popups.removeCard.text')}
            confirmText={i18n.t('payments.popups.removeCard.confirmText')}
            cancelText={i18n.t('payments.popups.removeCard.cancelText')}
            type="cancel"
            useCancelTextButton
            onSubmit={() => detachCard()}
            onClose={() => setIsCancelPopupVisible(false)}
          />

        </>
      </KeyboardAwareScrollView>
      <GenericErrorPopup
        isVisible={showError}
        closePopup={() => setShowError(false)
        }
      />
    </PageContainer>
  );
};

export default CardDetails;
