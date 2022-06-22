import React from 'react';
import { Image } from 'react-native';
import SafeView from '../SafeView';
import { HeaderView, ButtonHeaderView } from './styled';

import HamburgerIconSource from '../../assets/menu.png';


const Header = ({ navigation, menuSide }) => (
  <SafeView>
    <ButtonHeaderView onPress={() => navigation.openDrawer()} data-test-id="openNavPanelButton">
      <HeaderView menuSide={menuSide}>
        <Image style={{ width: 25, height: 25 }} source={HamburgerIconSource} />
      </HeaderView>
    </ButtonHeaderView>
  </SafeView>
);

export default Header;
