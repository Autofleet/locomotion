import React from 'react';
import { View } from 'react-native';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import PageHeader from '../PageHeader';
import i18n from '../../I18n';
import {
  StyledDrawerLabel, DrawerIcon, LabelText, Arrow,
} from './styled';

const closeIconSource = require('../../assets/x.png');

export const DrawerLabel = (props) => {
  const {
    focused, tintColor, title, icon
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
  const { navigation, screenProps } = props;

  const closeComponent = () => {
    navigation.closeDrawer();
  };
  return (
    <View style={{padding: 10}}>
      <SafeAreaView>
        <PageHeader
          title={i18n.t('menu.title')}
          iconSide='right'
          onIconPress={() => closeComponent()}
          icon={closeIconSource}
          width="18px"
          height="18px"
        />
        <DrawerItems {...props} />
      </SafeAreaView>
    </View>
  );
};
