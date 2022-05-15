import React from 'react';
import propsTypes from 'prop-types';
import {
  Header, HeaderText, HeaderIconContainer, HeaderIcon,
} from './styled';

const HamburgerIconSource = require('../../assets/menu.png');

const PageHeader = ({
  title, icon, onIconPress, iconSide, displayIcon, width, height,
}) => (
    <Header>
      <HeaderText>{title}</HeaderText>
      {displayIcon !== false
        ? (
          <HeaderIconContainer side={iconSide} onPress={onIconPress} data-test-id='NavigationPanelButton'>
            <HeaderIcon width={width} height={width} source={icon} side={iconSide} />
          </HeaderIconContainer>
        ) : null}
    </Header>
);

export default PageHeader;

PageHeader.defaultProps = {
  title: '',
  icon: HamburgerIconSource,
  iconSide: 'left',
  onIconPress: () => null,
  height: '25px',
  width: '25px',
};

PageHeader.propTypes = {
  title: propsTypes.string,
  icon: propsTypes.string,
  iconSide: propsTypes.string,
  onIconPress: propsTypes.func,
  width: propsTypes.string,
  height: propsTypes.string,
};
