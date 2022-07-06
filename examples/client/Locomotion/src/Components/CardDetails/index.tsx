import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View } from 'react-native';
import { Text } from '../../pages/Profile/ScreenText/styles';
import { FONT_WEIGHTS } from '../../context/theme';
import ConfirmationPopup from '../../popups/ConfirmationPopup';
import { getLastFourForamttedShortLong } from '../../pages/Payments/cardDetailUtils';
import { MAIN_ROUTES } from '../../pages/routes';
import { Card } from '../../pages/Account';
import {
  CardsContainer,
  CardsTitle,
  Container,
  LogoutContainer,
  CardText,
} from '../../pages/Account/styled';
import i18n from '../../I18n';
import PageHeader from '../PageHeader';
import { PaymentMethodInterface } from '../../context/payments/interface';
import { getTogglePopupsState } from '../../context/state';
import PaymentsContext from '../../context/payments';
import deleteIcon from '../../assets/delete.svg';
import SvgIcon from '../SvgIcon';


export default ({
  loadingState = false,
  navigation = undefined,
}) => {
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
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

  useEffect(() => {
    setIsEnabled(paymentMethod.isDefault);
  }, [paymentMethod]);


  return (
    <KeyboardAwareScrollView extraScrollHeight={20} enableOnAndroid>
      <PageHeader
        title="Payment method details"
        onIconPress={() => navigation.navigate(MAIN_ROUTES.PAYMENT)}
        iconSide=""
        displayIcon={undefined}
        showSkipButton={undefined}
        onPressSkip={undefined}
        action={undefined}
      />
      <>
        <Container>
          <CardsContainer>
            <CardsTitle style={{ boxShadow: '100px' }}>
              Credit Card informatiion
            </CardsTitle>
            <Card
              title={i18n.t('onboarding.namePlaceholder')}
              onPress={undefined}
              verified={undefined}
              showUnverified={undefined}
            >
              {paymentMethod?.name}

            </Card>
            <Card
              verified={false}
              showUnverified={false}
              title="Card Number"
              onPress={undefined}
            >
              {getLastFourForamttedShortLong(paymentMethod?.lastFour)}

            </Card>
            <Card
              verified={false}
              showUnverified={false}
              title="Balance"
              onPress={undefined}
            >
              Oustanding balance of TODO
            </Card>
            <LogoutContainer
              onPress={async () => {
                await onRemoveMethod(paymentMethod?.id);
              }}
            >
              <View style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%',
              }}
              >
                <SvgIcon Svg={deleteIcon} style={{ marginRight: 10, marginTop: 8 }} fill="red" />
                <Text style={{
                  display: 'flex', color: '#f35657', fontFamily: 'Inter-Regular', fontWeight: '600', justifyContent: 'flex-start',
                }}
                >
                  Delete payment method
                </Text>
              </View>
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
