import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ConfirmationPopup from '../../popups/ConfirmationPopup';
import { getLastFourForamttedLong } from '../../pages/Payments/cardDetailUtils';
import { MAIN_ROUTES } from '../../pages/routes';
import Card from '../InformationCard';
import {
  CardsContainer,
  CardsTitle,
  Container,
  LogoutContainer,
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
    await usePayments.detachPaymentMethod(methodForDelete);
    await usePayments.loadCustomer();
    setLoading(false);
    setIsCancelPopupVisible(false);
    navigation.navigate(MAIN_ROUTES.PAYMENT);
  };

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
                title={i18n.t('payments.cardDetails.balance')}
              >
                {i18n.t('payments.cardDetails.outstandingBalanceText')}
              </Card>
              <LogoutContainer
                onPress={async () => {
                  await onRemoveMethod(paymentMethod?.id);
                }}
              >
                <DeleteContainer>
                  <DeleteIcon Svg={deleteIcon} />
                  <DeleteText>
                    {i18n.t('payments.cardDetails.deleteText')}
                  </DeleteText>
                </DeleteContainer>
              </LogoutContainer>
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
    </PageContainer>
  );
};

export default CardDetails;
