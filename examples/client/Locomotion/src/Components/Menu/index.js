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

import History from '../../assets/history.png';
import HelpIconSource from '../../assets/menuItems/help.png';
import CreditCardIconSource from '../../assets/menuItems/creditcard.png';

const DrawerHeader = ({ navigateTo }) => {
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
      <HeaderLink onPress={() => navigateTo(MAIN_ROUTES.ACCOUNT)}>
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
    <DrawerIcon source={icon} focused={focused} fill="#fff" />
    <LabelText color={tintColor} focused={focused}>{title}</LabelText>
  </StyledDrawerLabel>
);

export const DrawerContentComponent = ({ navigation, state }) => {
  const route = state.routes[state.index].name;
  const navigateTo = (page) => {
    navigation.closeDrawer();
    navigation.navigate(page);
  };
  return (
    <StyledSafeAreaView>
      <DrawerHeader navigateTo={p => navigateTo(p)} />
      <DrawerLabelsContainer>
        <DrawerLabel
          title={i18n.t('menu.trips')}
          icon={History}
          onPress={() => navigateTo(MAIN_ROUTES.RIDE_HISTORY)}
          focused={route === MAIN_ROUTES.RIDE_HISTORY}
        />
        <DrawerLabel
          title={i18n.t('menu.paymentsSettings')}
          icon={CreditCardIconSource}
          onPress={() => navigateTo(MAIN_ROUTES.PAYMENT)}
          focused={route === MAIN_ROUTES.PAYMENT}
        />
        <DrawerLabel
          title={i18n.t('menu.support')}
          icon={HelpIconSource}
          onPress={() => navigateTo(MAIN_ROUTES.CONTACT_US)}
          focused={route === MAIN_ROUTES.CONTACT_US}
        />
      </DrawerLabelsContainer>
      <Bottom />
    </StyledSafeAreaView>
  );
};
