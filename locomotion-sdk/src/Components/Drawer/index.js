import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  DrawerItemList,
} from '@react-navigation/drawer';
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
  const navigation = useNavigation()
console.log('thisisisi')
  const closeComponent = () => {
    props.navigation.closeDrawer();
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
        <DrawerItemList {...props} />
      </SafeAreaView>
    </View>
  );
};
