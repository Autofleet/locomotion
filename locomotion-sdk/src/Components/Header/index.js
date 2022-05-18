import React from 'react';
import { Image } from 'react-native';
import Button from '../Button';
import SafeView from '../SafeView';
import { HeaderView } from './styled';

const HamburgerIconSource = require('../../assets/menu.png');


const Header = ({ navigation, menuSide }) => (
  <SafeView>
    <Button onPress={() => navigation.openDrawer()} data-test-id="openNavPanelButton">
      <HeaderView menuSide={menuSide}>
        <Image style={{ width: 25, height: 25 }} source={HamburgerIconSource} />
      </HeaderView>
    </Button>
  </SafeView>
);

export default Header;
