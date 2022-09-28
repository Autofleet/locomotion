import React, { useContext, useEffect, useState } from 'react';
import Bottom from './bottom';
import { MAIN_ROUTES } from '../../pages/routes';
import Thumbnail from '../Thumbnail';
import i18n from '../../I18n';
import {
  StyledDrawerLabel,
  LabelText,
  StyledSafeAreaView,
  HeaderText,
  HeaderMainText,
  Header,
  HeaderLink,
  DrawerLabelsContainer,
} from './styled';
import { UserContext } from '../../context/user';
import CalendarIcon from '../../assets/calendar.svg';
import History from '../../assets/history.svg';
import HelpIconSource from '../../assets/help.svg';
import CreditCardIconSource from '../../assets/credit-card.svg';
import SvgIcon from '../SvgIcon';
import settings from '../../context/settings';
import SETTINGS_KEYS from '../../context/settings/keys';
import * as navigationService from '../../services/navigation';

const DrawerHeader = ({ navigateTo }) => {
  const { user } = useContext(UserContext);
  return (
    <Header>
      {user && (
        <Thumbnail
          onPress={() => navigateTo(MAIN_ROUTES.ACCOUNT)}
          size={60}
          source={user.avatar}
        />
      )}
      <HeaderMainText>
        {user ? `${user.firstName} ${user.lastName}` : ''}
      </HeaderMainText>
      <HeaderLink testID="userProfile" onPress={() => navigateTo(MAIN_ROUTES.ACCOUNT)}>
        <HeaderText>
          {i18n.t('menu.account')}
        </HeaderText>
      </HeaderLink>
    </Header>
  );
};

const DrawerLabel = ({
  onPress, focused, tintColor, title, icon, lastItem, iconFill, testID,
}) => (
  <StyledDrawerLabel focused={focused} onPress={onPress} lastItem={lastItem} testID={testID}>
    <SvgIcon Svg={icon} width={23} height={23} style={{ marginRight: 15 }} fill={iconFill} />
    <LabelText color={tintColor} focused={focused}>{title}</LabelText>
  </StyledDrawerLabel>
);

export const DrawerContentComponent = ({ navigation, state }) => {
  const route = state.routes[state.index].name;
  const { getSettingByKey } = settings.useContainer();
  const [futureRidesEnabled, setFutureRidesEnabled] = useState(false);

  const navigateTo = (page) => {
    navigation.closeDrawer();
    navigationService.navigate(page);
  };

  const checkFutureRidesSetting = async () => {
    const settingValue = await getSettingByKey(
      SETTINGS_KEYS.FUTURE_RIDES_ENABLED,
    );
    setFutureRidesEnabled(settingValue);
  };

  useEffect(() => {
    checkFutureRidesSetting();
  }, []);
  return (
    <StyledSafeAreaView>
      <DrawerHeader navigateTo={p => navigateTo(p)} />
      <DrawerLabelsContainer>
        <DrawerLabel
          title={i18n.t('menu.messages')}
          icon={CalendarIcon}
          onPress={() => navigateTo(MAIN_ROUTES.MESSAGES)}
          iconFill="#333"
          focused={route === MAIN_ROUTES.MESSAGES}
        />
        <DrawerLabel
          title={i18n.t('menu.trips')}
          icon={History}
          onPress={() => navigateTo(MAIN_ROUTES.RIDE_HISTORY)}
          focused={route === MAIN_ROUTES.RIDE_HISTORY}
        />
        {futureRidesEnabled && (
        <DrawerLabel
          testID="futureRidesDrawer"
          title={i18n.t('menu.futureRides')}
          icon={CalendarIcon}
          onPress={() => navigateTo(MAIN_ROUTES.FUTURE_RIDES)}
          iconFill="#333"
          focused={route === MAIN_ROUTES.FUTURE_RIDES}
        />
        )}
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
