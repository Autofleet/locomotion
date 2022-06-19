import React, {useEffect, useContext} from 'react';
import {useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TouchableOpacity, View} from 'react-native';
import {MAIN_ROUTES} from '../routes';

import ThumbnailPicker from '../../Components/ThumbnailPicker';
import {
  AccountHeaderContainer,
  AccountHeaderIndicatorContainer,
  AccountHeaderMainContainer,
  AccountHeaderMainText,
  AccountHeaderSubText,
  Arrow,
  CardContainer,
  CardContantContainer,
  CardsContainer,
  CardsTitle,
  CardText,
  CardTitle,
  Container,
  FlexCenterContainer,
  LogoutContainer,
  ArrowContainer,
  VerifyContainer,
  VerifyText,
  CardTitleContainer,
  LogoutText,
} from './styled';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import Mixpanel from '../../services/Mixpanel';
import {PageContainer} from '../styles';
import {UserContext} from '../../context/user';

const AccountHeader = () => {
  const {updateUserInfo, user} = useContext(UserContext);

  const onImageChoose = image => {
    updateUserInfo({avatar: image});
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

const Card = ({
  title,
  children,
  onPress,
  verified,
  showUnverified,
  ...props
}) => {
  const MainContainer = onPress ? TouchableOpacity : View;
  return (
    <MainContainer onPress={onPress} {...props}>
      <CardContainer>
        <CardContantContainer>
          <CardTitleContainer>
            <CardTitle>{title}</CardTitle>
            {verified ? (
              <View>
                <VerifyContainer>
                  <VerifyText>{i18n.t('onboarding.verified')}</VerifyText>
                </VerifyContainer>
              </View>
            ) : (
              <>
                {showUnverified ? (
                  <View>
                    <VerifyContainer unverified>
                      <VerifyText>{i18n.t('onboarding.unverified')}</VerifyText>
                    </VerifyContainer>
                  </View>
                ) : undefined}
              </>
            )}
          </CardTitleContainer>
          <CardText>{children}</CardText>
        </CardContantContainer>
        <ArrowContainer>{onPress ? <Arrow /> : undefined}</ArrowContainer>
      </CardContainer>
    </MainContainer>
  );
};

const AccountContent = ({navigation}) => {
  const {user} = useContext(UserContext);
  return (
    <Container>
      <CardsContainer>
        <CardsTitle>{i18n.t('onboarding.accountInformation')}</CardsTitle>
        <Card
          title={i18n.t('onboarding.namePlaceholder')}
          onPress={() =>
            navigation.navigate(MAIN_ROUTES.NAME, {
              editAccount: true,
            })
          }>
          {user ? `${user.firstName} ${user.lastName}` : ''}
        </Card>
        <Card title={i18n.t('onboarding.phonePlaceholder')}>
          {user ? `${user.phoneNumber}` : ''}
        </Card>
        <Card
          verified={user && user.isEmailVerified}
          showUnverified
          title={i18n.t('onboarding.emailPlaceholder')}
          onPress={() =>
            navigation.navigate(MAIN_ROUTES.EMAIL, {
              editAccount: true,
            })
          }>
          {user ? `${user.email}` : ''}
        </Card>
        {paymentMethods && paymentMethods.length
          ? paymentMethods.map(pm => (
            <Card
              title={i18n.t('onboarding.paymentMethodPlaceholder')}
              onPress={() => navigation.navigate(MAIN_ROUTES.PAYMENT, {
                back: true,
              })}
            >
              {
             moment(pm.expiresAt).format('MM/YY')
           }
            </Card>
          ))
          : undefined}
        <LogoutContainer
          onPress={() => {
            navigation.navigate(MAIN_ROUTES.LOGOUT);
          }}>
          <LogoutText>{i18n.t('menu.logout')}</LogoutText>
        </LogoutContainer>
      </Container>
    </Container>
  );
};

export default ({navigation, menuSide}) => {
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
