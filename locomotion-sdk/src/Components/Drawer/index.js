import React from 'react';
import PageHeader from '../PageHeader';
import i18n from '../../I18n';
import {
  StyledDrawerLabel, DrawerIcon, LabelText, Arrow, StyledSafeAreaView,
} from './styled';
import { ROUTES } from '../../pages/consts';

const CarIconSource = require('../../assets/menuItems/car.png');
const HelpIconSource = require('../../assets/menuItems/help.png');
const CreaditCardIconSource = require('../../assets/menuItems/creditcard.png');
const PplIconSource = require('../../assets/menuItems/person.png');
const HomeIconSource = require('../../assets/menuItems/home.png');
const LogoutIconSource = require('../../assets/menuItems/logout.png');

const closeIconSource = require('../../assets/x.png');

const DrawerLabel = ({
  onPress, focused, tintColor, title, icon, lastItem,
}) => (
  <StyledDrawerLabel focused={focused} onPress={onPress} lastItem={lastItem}>
    <DrawerIcon source={icon} fill="#fff" style={{ fill: '#fff' }} />
    <LabelText color={tintColor}>{title}</LabelText>
    <Arrow />
  </StyledDrawerLabel>
);

export const DrawerContentComponent = ({ navigation, state }) => {
  const route = state.routes[state.index].name;
  const closeComponent = () => {
    navigation.closeDrawer();
  };
  return (
    <StyledSafeAreaView>
      <PageHeader
        title={i18n.t('menu.title')}
        iconSide="right"
        onIconPress={() => closeComponent()}
        icon={closeIconSource}
        width="18px"
        height="18px"
      />
      <DrawerLabel
        title={i18n.t('menu.home')}
        icon={HomeIconSource}
        onPress={() => {
          navigation.navigate(ROUTES.HOME);
        }}
        focused={route === ROUTES.HOME}
      />
      <DrawerLabel
        title={i18n.t('menu.trips')}
        icon={CarIconSource}
        onPress={() => {
          navigation.navigate(ROUTES.RIDE_HISTORY);
        }}
        focused={route === ROUTES.RIDE_HISTORY}
      />
      <DrawerLabel
        title={i18n.t('menu.paymentsSettings')}
        icon={CreaditCardIconSource}
        onPress={() => {
          navigation.navigate(ROUTES.PAYMENT);
        }}
        focused={route === ROUTES.PAYMENT}
      />
      <DrawerLabel
        title={i18n.t('menu.account')}
        icon={PplIconSource}
        onPress={() => {
          navigation.navigate(ROUTES.ACCOUNT);
        }}
      />
      <DrawerLabel
        title={i18n.t('menu.support')}
        icon={HelpIconSource}
        onPress={() => {
          navigation.navigate(ROUTES.CONTACT_US);
        }}
        focused={route === ROUTES.CONTACT_US}
      />
      <DrawerLabel
        title={i18n.t('menu.logout')}
        icon={LogoutIconSource}
        onPress={() => {
          navigation.navigate(ROUTES.LOGOUT);
        }}
        lastItem
      />
    </StyledSafeAreaView>
  );
};
