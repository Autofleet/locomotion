import React, { useEffect, useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ROUTES } from '../routes';

import ThumbnailPicker from '../../Components/ThumbnailPicker';
import {
  ErrorText,
} from '../Login/styled';
import {
  AccountHeaderContainer,
  AccountHeaderIndicatorContainer,
  AccountHeaderMainContainer, AccountHeaderMainText,
  AccountHeaderSubText,
  Arrow, CardContainer, CardContantContainer, CardsContainer, CardsTitle, CardText, CardTitle,
  Container, FlexCenterContainer, LogoutContainer,
} from './styled';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import Mixpanel from '../../services/Mixpanel';
import { PageContainer } from '../styles';
import { UserContext } from '../../context/user';
import onboardingContext from '../../context/onboarding';

const AccountHeader = () => {
  const {
    onboardingState: user,
  } = onboardingContext.useContainer();

  return (
    <AccountHeaderContainer>
      <FlexCenterContainer>
        <ThumbnailPicker
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
            <AccountHeaderSubText>
              12 Trips
            </AccountHeaderSubText>
          </AccountHeaderMainContainer>
          <AccountHeaderMainContainer>
            <AccountHeaderSubText>
              200 Miles
            </AccountHeaderSubText>
          </AccountHeaderMainContainer>
        </AccountHeaderIndicatorContainer>
      </AccountHeaderMainContainer>
    </AccountHeaderContainer>
  );
};

const Card = ({ children, ...props }) => (
  <CardContainer {...props}>
    <CardContantContainer>
      {children}
    </CardContantContainer>
    <Arrow />
  </CardContainer>
);

const AccountContent = ({ navigation }) => {
  const {
    onboardingState: user,
  } = onboardingContext.useContainer();

  return (
    <Container>
      <CardsContainer>
        <CardsTitle>
          Account information
        </CardsTitle>
        <Card
          onPress={() => {
            navigation.navigate('Name');
          }}
        >
          <CardTitle>
            Name
          </CardTitle>
          <CardText>
            {user ? `${user.firstName} ${user.lastName}` : ''}
          </CardText>
        </Card>
        <Card>
          <CardTitle>
            Phone number
          </CardTitle>
          <CardText>
            {user ? `${user.phoneNumber}` : ''}
          </CardText>
        </Card>
        <Card>
          <CardTitle>
            Email
          </CardTitle>
          <CardText>
            {user ? `${user.email}` : ''}
          </CardText>
        </Card>

        <CardsTitle>
          Payment Preferences
        </CardsTitle>
        <Card>
          <CardTitle>
            Default tip
          </CardTitle>
          <CardText>
            5%
          </CardText>
        </Card>

      </CardsContainer>
    </Container>
  );
};

export default ({
  navigation, menuSide,
}) => {
  const { user } = useContext(UserContext);
  const route = useRoute();

  useEffect(() => {
    if (route.params) {
      Mixpanel.pageView(route.name);
    }
  }, []);

  return (
    <PageContainer>
      <KeyboardAwareScrollView
        extraScrollHeight={20}
        enableOnAndroid
      >
        <PageHeader
          title={i18n.t('onboarding.pageTitle')}
          onIconPress={() => navigation.toggleDrawer()}
          iconSide={menuSide}
        >
          <>
            <AccountHeader />
            <LogoutContainer
              onPress={() => {
                navigation.navigate(ROUTES.LOGOUT);
              }}
            >
              <ErrorText>{i18n.t('menu.logout')}</ErrorText>
            </LogoutContainer>
          </>
        </PageHeader>
        <AccountContent
          navigation={navigation}
        />
      </KeyboardAwareScrollView>
    </PageContainer>
  );
};
