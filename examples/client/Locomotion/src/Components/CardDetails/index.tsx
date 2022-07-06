import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import payments from 'context/payments';
import { capitalizeFirstLetter, getLastFourForamtted } from '../../pages/Payments/cardDetailUtils';
import { PageContainer } from '../../pages/Profile/styles';
import { MAIN_ROUTES } from '../../pages/routes';
import { Text } from '../../pages/Profile/ScreenText/styles';
import { Card } from '../../pages/Account';
import {
  CardsContainer,
  CardsTitle,
  Container,
  LogoutContainer,
  LogoutText,
} from '../../pages/Account/styled';
import i18n from '../../I18n';
import PageHeader from '../PageHeader';


export default ({
  loadingState = false,
  onAddClick = undefined,
  navigation = undefined,
}) => {
  const [loading, setLoading] = useState(false);
  const route = useRoute();

  useEffect(() => {
    setLoading(loadingState);
  }, [loading]);

  console.log(route.params);

  const paymentMethod = route?.params;

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
              title="cardNumber"
              onPress={undefined}
            >
              {getLastFourForamtted(paymentMethod?.lastFour)}

            </Card>
            <Card
              verified={false}
              showUnverified={false}
              title="Balance"
              onPress={undefined}
            >
              {'Oustanding balance of TODO}'
}
            </Card>
            <Card
              verified={false}
              showUnverified={false}
              title="Balance"
              onPress={undefined}
            >
              {'Oustanding balance of TODO}'
}
            </Card>
            <LogoutContainer
              onPress={() => {
                paymentMethod?.onDetach();
              }}
            >
              <LogoutText>delete</LogoutText>
            </LogoutContainer>
          </CardsContainer>
        </Container>
      </>
    </KeyboardAwareScrollView>

  );
};
