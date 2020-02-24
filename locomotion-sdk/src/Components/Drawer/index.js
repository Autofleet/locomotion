import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { DrawerItems, SafeAreaView } from 'react-navigation';

const closeIconSource = require('../../assets/x.png');
const ArrowIconSource = require('../../assets/arrowright.png');

const defaultTextColor = '#686868';
const drawerPadding = 25;

const DrawerIcon = styled.Image`
  width: 16px;
  height: 16px;
  margin-right: 20px;
  opacity: 0.6;
`;

const Arrow = styled.Image.attrs({ source: ArrowIconSource })`
  position: absolute;
  right: 0;
  top: ${(drawerPadding + 5)}px;
  opacity: 0.4;
  margin-right: 10px;
  width: 10px;
  height: 10px;
`;

const LabelText = styled.Text(props => `
  color: ${props.color || defaultTextColor};
`);

const StyledDrawerLabel = styled.View`
  margin: 0 35px;
  border-color: #dfdfdf;
  border-bottom-width: 1px;
  padding: ${drawerPadding}px;
  width: 100%;
  flex-direction: row;
  flex: 1;
`;

export const DrawerLabel = (props) => {
  const {
    focused, tintColor, title, icon,
  } = props;
  return (
    <StyledDrawerLabel>
      <DrawerIcon source={icon} />
      <LabelText color={tintColor}>{title}</LabelText>
      <Arrow />
    </StyledDrawerLabel>
  );
};

const HeaderText = styled.Text(props => `
  color: ${props.color || defaultTextColor};
  font-weight: bold;  
  text-align: center;
`);

const HeaderExit = styled(TouchableOpacity)`
  position: absolute;
  right: 0;
  top: ${(drawerPadding + 5)}px;
  margin-right: 30px;
`;

const HeaderExitIcon = styled.Image.attrs({ source: closeIconSource })`
  width: 13px;
  height: 13px;
`;

const Header = styled.View`
text-align: center;
padding: ${drawerPadding}px;
`;

export const DrawerContentComponent = (props) => {
  const { navigation } = props;
  const closeComponent = () => {
    navigation.closeDrawer();
  };
  return (
    <View>
      <SafeAreaView>
        <Header>
          <HeaderText>Menü</HeaderText>
            <HeaderExit onPress={() => closeComponent()}>
                <HeaderExitIcon />
            </HeaderExit>
        </Header>
        <DrawerItems {...props} />
      </SafeAreaView>
    </View>
  );
};
