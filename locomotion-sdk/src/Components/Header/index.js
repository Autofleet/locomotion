import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components';
import SafeView from '../SafeView';

const HamburgerIconSource = require('../../assets/menu.png');

const HeaderView = styled.View`

  margin-top: 14px;
  margin-left: 14px;
`;

const Header = ({ navigation }) => (
  <SafeView>
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <HeaderView>
        <Image styled={{ width: 60, height: 60 }} source={HamburgerIconSource} />
      </HeaderView>
    </TouchableOpacity>
  </SafeView>
);

export default Header;
