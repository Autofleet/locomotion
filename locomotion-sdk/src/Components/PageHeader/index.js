import React from 'react';
import propsTypes from 'prop-types';
import {Header, HeaderText, HeaderIconContainer, HeaderIcon} from './styled';
import SafeView from '../SafeView';
const HamburgerIconSource = require('../../assets/menu.png');

const PageHeader = ({
  title, icon, onIconPress, iconSide, displayIcon, width, height
}) => (
  <SafeView>
    <Header>
      <HeaderText>{title}</HeaderText>
      {displayIcon !== false ?
      <HeaderIconContainer side={iconSide} onPress={onIconPress}>
        <HeaderIcon width={width} height={width} source={icon} side={iconSide} />
      </HeaderIconContainer> : null}
    </Header>
  </SafeView>
);

export default PageHeader;

PageHeader.defaultProps = {
  title: '',
  icon: HamburgerIconSource,
  iconSide: 'left',
  onIconPress: () => null,
  height: '25px',
  width: '25px'
};

PageHeader.propTypes = {
  title: propsTypes.string,
  icon: propsTypes.string,
  iconSide: propsTypes.string,
  onIconPress: propsTypes.func,
  width: propsTypes.string,
  height: propsTypes.string
};
