import React, { useEffect, useContext, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { PaymentIcon } from 'react-native-payment-icons';
import cashPaymentMethod from '../../pages/Payments/cashPaymentMethod';
import Card from '../../Components/InformationCard';
import PaymentsContext from '../../context/payments';
import { MAIN_ROUTES } from '../routes';

import ThumbnailPicker from '../../Components/ThumbnailPicker';
import {
  AccountHeaderContainer,
  AccountHeaderIndicatorContainer,
  AccountHeaderMainContainer,
  AccountHeaderMainText,
  AccountHeaderSubText,
  CardsContainer,
  Container,
  FlexCenterContainer,
  LogoutContainer,
  LogoutText,
  Type,
  PaymentMethodContent,
} from './styled';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import CardsTitle from '../../Components/CardsTitle';
import Mixpanel from '../../services/Mixpanel';
import { PageContainer } from '../styles';
import { UserContext } from '../../context/user';

const AccountHeader = () => {
  const { updateUserInfo, user } = useContext(UserContext);

  const onImageChoose = (image) => {
    updateUserInfo({ avatar: image });
  };

  return (
    <AccountHeaderContainer>
      <FlexCenterContainer>
        <ThumbnailPicker
          onImageChoose={onImageChoose}
          size={125}
          avatarSource={user.avatar}
        />
      </FlexCenterContainer>
      <AccountHeaderMainContainer>
        <AccountHeaderMainText>
          {user ? `${user.firstName} ${user.lastName}` : ''}
        </AccountHeaderMainText>
        <AccountHeaderIndicatorContainer>
          <AccountHeaderMainContainer>
            <AccountHeaderSubText>{/* todo 12 Trips */}</AccountHeaderSubText>
          </AccountHeaderMainContainer>
          <AccountHeaderMainContainer>
            <AccountHeaderSubText>{/* todo 200 Miles */}</AccountHeaderSubText>
          </AccountHeaderMainContainer>
        </AccountHeaderIndicatorContainer>
      </AccountHeaderMainContainer>
    </AccountHeaderContainer>
  );
};

const AccountContent = ({ navigation }) => {
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(null);

  const { user } = useContext(UserContext);
  const { getClientDefaultMethod } = PaymentsContext.useContainer();
  useEffect(() => {
    const updateDefault = async () => {
      const newDefault = await getClientDefaultMethod();
      setDefaultPaymentMethod(newDefault);
    };

    updateDefault();
  }, []);
  const emailIsVerified = user?.isEmailVerified;
  const onEmailPress = () => (emailIsVerified
    ? navigation.navigate(MAIN_ROUTES.EMAIL, {
      editAccount: true,
    })
    : navigation.navigate(MAIN_ROUTES.EMAIL_CODE, {
      editAccount: true,
    }));
  return (
    <Container>
      <CardsContainer>
        <CardsTitle title={i18n.t('onboarding.accountInformation')} />
        <Card
          title={i18n.t('onboarding.namePlaceholder')}
          onPress={() => navigation.navigate(MAIN_ROUTES.NAME, {
            editAccount: true,
          })
          }
        >
          {user ? `${user.firstName} ${user.lastName}` : ''}
        </Card>
        <Card
          title={i18n.t('onboarding.phonePlaceholder')}
        >
          {user ? `${user.phoneNumber}` : ''}
        </Card>
        <Card
          verified={emailIsVerified}
          showUnverified
          title={i18n.t('onboarding.emailPlaceholder')}
          onPress={onEmailPress}
        >
          {user ? `${user.email}` : ''}
        </Card>
        {defaultPaymentMethod && defaultPaymentMethod.id !== cashPaymentMethod.id ? (
          <>
            <CardsTitle title={i18n.t('onboarding.paymentInformation')} />
            <Card
              title={i18n.t('onboarding.paymentMethodPlaceholder')}
              onPress={() => navigation.navigate(MAIN_ROUTES.PAYMENT, {
                back: true,
              })}
            >
              <PaymentMethodContent>
                <PaymentIcon type={defaultPaymentMethod.brand} />
                <Type>{defaultPaymentMethod.name}</Type>
              </PaymentMethodContent>
            </Card>
          </>
        ) : undefined}
        <LogoutContainer
          onPress={() => {
            navigation.navigate(MAIN_ROUTES.LOGOUT);
          }}
        >
          <LogoutText>{i18n.t('menu.logout')}</LogoutText>
        </LogoutContainer>
      </CardsContainer>
    </Container>
  );
};

export default ({ navigation, menuSide }) => {
  const route = useRoute();

  useEffect(() => {
    if (route.params) {
      Mixpanel.pageView(route.name);
    }
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title={i18n.t('onboarding.pageTitle')}
        onIconPress={() => navigation.navigate(MAIN_ROUTES.HOME)}
        iconSide={menuSide}
      />
      <KeyboardAwareScrollView extraScrollHeight={20} enableOnAndroid>
        <AccountHeader />
        <AccountContent navigation={navigation} />
      </KeyboardAwareScrollView>
    </PageContainer>
  );
};
