import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components';
import Button from '../Button';
import SafeView from '../SafeView';

const HamburgerIconSource = require('../../assets/menu.png');

const HeaderView = styled.View`
  align-self: flex-start;
  margin-top: 14px;
  margin-left: 14px;

  ${({ menuSide }) => (menuSide === 'right' ? `
  align-self: flex-end;
  margin-right: 14px;
  margin-left: 0;
  ` : '')}
`;

const Button = styled(Button)``;

const Header = ({ navigation, menuSide }) => (
  <SafeView>
    <Button onPress={() => navigation.openDrawer()} data-test-id='openNavPanelButton'>
      <HeaderView menuSide={menuSide}>
        <Image style={{ width: 25, height: 25 }} source={HamburgerIconSource} />
      </HeaderView>
    </Button>
  </SafeView>
);

export default Header;
