import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View } from 'react-native';
import ConfirmationPopup from '../../popups/ConfirmationPopup';
import { getLastFourForamttedShortLong } from '../../pages/Payments/cardDetailUtils';
import { MAIN_ROUTES } from '../../pages/routes';
import { Card } from '../../pages/Account';
import {
  CardsContainer,
  CardsTitle,
  Container,
  LogoutContainer,
} from '../../pages/Account/styled';
import i18n from '../../I18n';
import PageHeader from '../PageHeader';
import { PaymentMethodInterface } from '../../context/payments/interface';
import { getTogglePopupsState } from '../../context/state';
import PaymentsContext from '../../context/payments';
import deleteIcon from '../../assets/delete.svg';
import { DeleteContainer, DeleteIcon, DeleteText } from './styled';


const CardDetails = ({
  loadingState = false,
  navigation = undefined,
}) => {
  const [loading, setLoading] = useState(false);
  const [methodForDelete, setMethodForDelete] = useState(null);
  const [, togglePopup] = getTogglePopupsState();
  const usePayments = PaymentsContext.useContainer();
  const route = useRoute();

  const onRemoveMethod = async (methodId: any) => {
    togglePopup('removeCard', true);
    setMethodForDelete(methodId);
  };

  const detachCard = async () => {
    setLoading(true);
    await usePayments.detachPaymentMethod(methodForDelete);
    await usePayments.loadCustomer();
    setLoading(false);
    togglePopup('removeCard', false);
    navigation?.navigate(MAIN_ROUTES.PAYMENT);
  };

  useEffect(() => {
    setLoading(loadingState);
  }, [loading]);


  const paymentMethod = route?.params?.paymentMethod as PaymentMethodInterface;


  return (
    <KeyboardAwareScrollView extraScrollHeight={20} enableOnAndroid>
      <PageHeader
        title={i18n.t('payments.cardDetails.title')}
        onIconPress={() => navigation?.navigate(MAIN_ROUTES.PAYMENT)}
        iconSide=""
        displayIcon={undefined}
        showSkipButton={undefined}
        onPressSkip={undefined}
        action={undefined}
      />
      <>
        <Container>
          <CardsContainer>
            <CardsTitle>
              {i18n.t('payments.cardDetails.cardsTitle')}
            </CardsTitle>
            <Card
              title={i18n.t('payments.cardDetails.nickname')}
              onPress={undefined}
              verified={undefined}
              showUnverified={undefined}
            >
              {paymentMethod?.name}

            </Card>
            <Card
              verified={false}
              showUnverified={false}
              title={i18n.t('payments.cardDetails.number')}
              onPress={undefined}
            >
              {getLastFourForamttedShortLong(paymentMethod?.lastFour)}

            </Card>
            <Card
              verified={false}
              showUnverified={false}
              title={i18n.t('payments.cardDetails.balance')}
              onPress={undefined}
            >
              {`${i18n.t('payments.cardDetails.outstandingBalanceText')} 3.12$`}
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
          name="removeCard"
          title={i18n.t('payments.popups.removeCard.title')}
          text={i18n.t('payments.popups.removeCard.text')}
          confirmText={i18n.t('payments.popups.removeCard.confirmText')}
          cancelText={i18n.t('payments.popups.removeCard.cancelText')}
          type="cancel"
          useCancelTextButton
          onSubmit={() => detachCard()}
        />
      </>
    </KeyboardAwareScrollView>

  );
};


export default CardDetails;
