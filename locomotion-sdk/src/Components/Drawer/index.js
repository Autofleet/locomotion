import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import PageHeader from "../PageHeader";

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

export const DrawerContentComponent = (props) => {
  const { navigation } = props;
  const closeComponent = () => {
    navigation.closeDrawer();
  };
  return (
    <View>
      <SafeAreaView>
        <PageHeader
          title="Menü"
          iconSide='right'
          onIconPress={() => closeComponent()}
          icon={closeIconSource}
        />
        <DrawerItems {...props} />
      </SafeAreaView>
    </View>
  );
};
