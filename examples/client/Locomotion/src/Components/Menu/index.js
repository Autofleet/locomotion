import React, {useContext} from 'react';
import {MAIN_ROUTES} from '../../pages/routes';
import Thumbnail from '../Thumbnail';
import i18n from '../../I18n';
import {
  StyledDrawerLabel,
  DrawerIcon,
  LabelText,
  StyledSafeAreaView,
  HeaderIconContainer,
  HeaderText,
  HeaderMainText,
  Header,
  HeaderLink,
} from './styled';
import {UserContext} from '../../context/user';

const CarIconSource = require('../../assets/menuItems/car.png');
const HelpIconSource = require('../../assets/menuItems/help.png');
const CreditCardIconSource = require('../../assets/menuItems/creditcard.png');
const HomeIconSource = require('../../assets/menuItems/home.png');

const closeIconSource = require('../../assets/x.png');

const DrawerHeader = ({onIconPress, navigation}) => {
  const {user} = useContext(UserContext);
  return (
    <Header>
      {user && <Thumbnail size={80} source={user.avatar} />}

      <HeaderMainText>
        {user ? `${user.firstName} ${user.lastName}` : ''}
      </HeaderMainText>
      <HeaderLink
        onPress={() => {
          navigation.navigate(MAIN_ROUTES.ACCOUNT);
        }}>
        <HeaderText>{i18n.t('menu.account')}</HeaderText>
      </HeaderLink>

      <HeaderIconContainer
        onPress={onIconPress}
        data-test-id="NavigationPanelButton">
        <DrawerIcon source={closeIconSource} height="18px" width="18px" />
      </HeaderIconContainer>
    </Header>
  );
};

const DrawerLabel = ({onPress, focused, tintColor, title, icon, lastItem}) => (
  <StyledDrawerLabel focused={focused} onPress={onPress} lastItem={lastItem}>
    <DrawerIcon
      source={icon}
      focused={focused}
      fill="#fff"
      style={{fill: '#fff'}}
    />
    <LabelText color={tintColor} focused={focused}>
      {title}
    </LabelText>
  </StyledDrawerLabel>
);

export const DrawerContentComponent = ({navigation, state}) => {
  const route = state.routes[state.index].name;
  const closeComponent = () => {
    navigation.closeDrawer();
  };
  return (
    <StyledSafeAreaView>
      <DrawerHeader
        navigation={navigation}
        onIconPress={() => closeComponent()}
      />
      <DrawerLabel
        title={i18n.t('menu.home')}
        icon={HomeIconSource}
        onPress={() => {
          navigation.navigate(MAIN_ROUTES.HOME);
        }}
        focused={route === MAIN_ROUTES.HOME}
      />
      <DrawerLabel
        title={i18n.t('menu.trips')}
        icon={CarIconSource}
        onPress={() => {
          navigation.navigate(MAIN_ROUTES.RIDE_HISTORY);
        }}
        focused={route === MAIN_ROUTES.RIDE_HISTORY}
      />
      <DrawerLabel
        title={i18n.t('menu.paymentsSettings')}
        icon={CreditCardIconSource}
        onPress={() => {
          navigation.navigate(MAIN_ROUTES.PAYMENT);
        }}
        focused={route === MAIN_ROUTES.PAYMENT}
      />
      <DrawerLabel
        title={i18n.t('menu.support')}
        icon={HelpIconSource}
        onPress={() => {
          navigation.navigate(MAIN_ROUTES.CONTACT_US);
        }}
        focused={route === MAIN_ROUTES.CONTACT_US}
      />
    </StyledSafeAreaView>
  );
};
