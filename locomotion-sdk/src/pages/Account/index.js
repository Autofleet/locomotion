import React, { useEffect, useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TouchableOpacity, View } from 'react-native';
import { AUTH_ROUTES, MAIN_ROUTES } from '../routes';

import ThumbnailPicker from '../../Components/ThumbnailPicker';
import {
  AccountHeaderContainer,
  AccountHeaderIndicatorContainer,
  AccountHeaderMainContainer, AccountHeaderMainText,
  AccountHeaderSubText, ErrorText,
  Arrow, CardContainer, CardContantContainer, CardsContainer, CardsTitle, CardText, CardTitle,
  Container, FlexCenterContainer, LogoutContainer, ArrowContainer,
} from './styled';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import Mixpanel from '../../services/Mixpanel';
import { PageContainer } from '../styles';
import { UserContext } from '../../context/user';

const AccountHeader = () => {
  const { user } = useContext(UserContext);


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

const Card = ({ children, onPress, ...props }) => {
  const MainContainer = onPress ? TouchableOpacity : View;
  return (
    <MainContainer onPress={onPress} {...props}>
      <CardContainer>
        <CardContantContainer>
          {children}
        </CardContantContainer>
        <ArrowContainer>
          {onPress ? <Arrow /> : undefined}
        </ArrowContainer>
      </CardContainer>
    </MainContainer>
  );
};

const AccountContent = ({ navigation }) => {
  const { user } = useContext(UserContext);

  return (
    <Container>
      <CardsContainer>
        <CardsTitle>
          Account information
        </CardsTitle>
        <Card
          onPress={() => {
            navigation.navigate(AUTH_ROUTES.NAME, {
              editAccount: true,
            });
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
        <Card
          onPress={() => {
            navigation.navigate(AUTH_ROUTES.EMAIL, {
              editAccount: true,
            });
          }}
        >
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
        />
        <AccountHeader />
        <LogoutContainer
          onPress={() => {
            navigation.navigate(MAIN_ROUTES.LOGOUT);
          }}
        >
          <ErrorText>{i18n.t('menu.logout')}</ErrorText>
        </LogoutContainer>
        <AccountContent
          navigation={navigation}
        />
      </KeyboardAwareScrollView>
    </PageContainer>
  );
};
