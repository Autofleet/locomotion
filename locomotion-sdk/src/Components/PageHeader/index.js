import React from 'react';
import propsTypes from 'prop-types';
import {Header, HeaderText, HeaderIconContainer, HeaderIcon} from './styled';
import SafeView from '../SafeView';
const HamburgerIconSource = require('../../assets/menu.png');

const PageHeader = ({
  title, icon, onIconPress, iconSide,
}) => (
  <SafeView>
    <Header>
      <HeaderText>{title}</HeaderText>
      <HeaderIconContainer side={iconSide} onPress={onIconPress}>
        <HeaderIcon source={icon} side={iconSide} />
      </HeaderIconContainer>
    </Header>
  </SafeView>
);
export default PageHeader;

PageHeader.defaultProps = {
  title: '',
  icon: HamburgerIconSource,
  iconSide: 'left',
  onIconPress: () => null,
};

PageHeader.propTypes = {
  title: propsTypes.string,
  icon: propsTypes.string,
  iconSide: propsTypes.string,
  onIconPress: propsTypes.func,
};
