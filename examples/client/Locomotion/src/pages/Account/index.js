import React, { useEffect, useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
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
  const { user } = useContext(UserContext);
  const { getClientDefaultMethod } = PaymentsContext.useContainer();
  const defaultPaymentMethod = getClientDefaultMethod();
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
          verified
          title={i18n.t('onboarding.phonePlaceholder')}
        >
          {user ? `${user.phoneNumber}` : ''}
        </Card>
        <Card
          verified={user && user.isEmailVerified}
          showUnverified
          title={i18n.t('onboarding.emailPlaceholder')}
          onPress={() => navigation.navigate(MAIN_ROUTES.EMAIL, {
            editAccount: true,
          })
          }
        >
          {user ? `${user.email}` : ''}
        </Card>
        {defaultPaymentMethod && (
          <>
            <CardsTitle title={i18n.t('onboarding.paymentInformation')} />
            <Card
              title={i18n.t('onboarding.paymentMethodPlaceholder')}
              onPress={() => navigation.navigate(MAIN_ROUTES.PAYMENT, {
                back: true,
              })}
            >
              {
            moment(defaultPaymentMethod.expiresAt).format('MM/YY')
          }
            </Card>
          </>
        )}
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
      <KeyboardAwareScrollView extraScrollHeight={20} enableOnAndroid>
        <PageHeader
          title={i18n.t('onboarding.pageTitle')}
          onIconPress={() => navigation.navigate(MAIN_ROUTES.HOME)}
          iconSide={menuSide}
        />
        <AccountHeader />
        <AccountContent navigation={navigation} />
      </KeyboardAwareScrollView>
    </PageContainer>
  );
};
