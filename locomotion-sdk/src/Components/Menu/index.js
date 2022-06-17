import React, { useContext } from 'react';
import Bottom from './bottom';
import { MAIN_ROUTES } from '../../pages/routes';
import Thumbnail from '../Thumbnail';
import i18n from '../../I18n';
import {
  StyledDrawerLabel,
  DrawerIcon,
  LabelText,
  StyledSafeAreaView,
  HeaderText,
  HeaderMainText,
  Header,
  HeaderLink,
  DrawerLabelsContainer,
} from './styled';
import { UserContext } from '../../context/user';

const History = require('../../assets/history.png');
const HelpIconSource = require('../../assets/menuItems/help.png');
const CreditCardIconSource = require('../../assets/menuItems/creditcard.png');

const DrawerHeader = ({ navigation }) => {
  const { user } = useContext(UserContext);
  return (
    <Header>
      {user && (
        <Thumbnail
          size={60}
          source={user.avatar}
        />
      )}

      <HeaderMainText>
        {user ? `${user.firstName} ${user.lastName}` : ''}
      </HeaderMainText>
      <HeaderLink
        onPress={() => {
          navigation.navigate(MAIN_ROUTES.ACCOUNT);
        }}
      >
        <HeaderText>
          {i18n.t('menu.account')}
        </HeaderText>
      </HeaderLink>
    </Header>
  );
};

const DrawerLabel = ({
  onPress, focused, tintColor, title, icon, lastItem,
}) => (
  <StyledDrawerLabel focused={focused} onPress={onPress} lastItem={lastItem}>
    <DrawerIcon source={icon} focused={focused} fill="#fff" style={{ fill: '#fff' }} />
    <LabelText color={tintColor} focused={focused}>{title}</LabelText>
  </StyledDrawerLabel>
);

export const DrawerContentComponent = ({ navigation, state }) => {
  const route = state.routes[state.index].name;
  const closeComponent = () => {
    navigation.closeDrawer();
  };
  return (
    <StyledSafeAreaView>
      <DrawerHeader navigation={navigation} />
      <DrawerLabelsContainer>
        <DrawerLabel
          title={i18n.t('menu.trips')}
          icon={History}
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
      </DrawerLabelsContainer>
      <Bottom />
    </StyledSafeAreaView>
  );
};
