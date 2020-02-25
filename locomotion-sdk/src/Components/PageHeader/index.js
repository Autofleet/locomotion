import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import propsTypes from 'prop-types';
import SafeView from '../SafeView';

const HamburgerIconSource = require('../../assets/menu.png');

const defaultTextColor = '#686868';
const iconTopPadding = 25;

const HeaderText = styled.Text(props => `
  color: ${props.color || defaultTextColor};
  font-weight: bold;  
  text-align: center;
`);

const HeaderIconContainer = styled(TouchableOpacity)(({ side }) => `
  position: absolute;
  top: ${(iconTopPadding)};

  right: ${side === 'right' ? 0 : null};
  margin-right: ${side === 'right' ? 30 : null};
  
  left: ${side === 'left' ? 0 : null};
  margin-left: ${side === 'left' ? 13 : null};
`);

const HeaderIcon = styled.Image(({ side }) => `
  width: ${side === 'left' ? 19 : 13};
  height: ${side === 'left' ? 19 : 13};
`);

const Header = styled.View`
text-align: center;
padding: ${iconTopPadding}px;
`;

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
