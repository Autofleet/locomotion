import React from 'react';
import propsTypes from 'prop-types';
import { Platform, Text, View } from 'react-native';
import {
  Header, HeaderText, HeaderIconContainer, HeaderIcon, SkipButton, SkipButtonText,
} from './styled';
import i18n from '../../I18n';
import backArrow from '../../assets/arrow-back.png';

interface PageHeaderProps {
  title: string,
  icon?: any,
  onIconPress?: () => void,
  iconSide?: 'right' | 'left',
  displayIcon?: boolean,
  width?: number,
  showSkipButton?: boolean,
  onPressSkip?: () => void,
  action?: any,
}

const PageHeader = ({
  title, icon, onIconPress, iconSide, displayIcon, width, showSkipButton, onPressSkip, action,
}: PageHeaderProps) => (
  <Header style={Platform.OS === 'android' ? { shadowColor: '#000' } : {}}>
    {displayIcon !== false
      ? (
        <HeaderIconContainer side={iconSide} onPress={onIconPress} testID="NavigationPanelButton">
          <HeaderIcon width={width} height={width} source={icon} side={iconSide} />
        </HeaderIconContainer>
      ) : <View />}
    <HeaderText numberOfLines={2} style={{ color: 'transparent', position: 'relative' }}>{title}</HeaderText>
    <HeaderText numberOfLines={2}>{title}</HeaderText>
    {showSkipButton
      && (
      <SkipButton
        testID="skipButton"
        noBackground
        noLoader
        onPress={onPressSkip}
      >

        <SkipButtonText>
          {i18n.t('general.skip')}
        </SkipButtonText>
      </SkipButton>
      )}
    {action}
  </Header>
);

export default PageHeader;

PageHeader.defaultProps = {
  icon: backArrow,
  iconSide: 'left',
  onIconPress: () => null,
  width: '25px',
  displayIcon: true,
  showSkipButton: false,
  onPressSkip: null,
  action: null,
};
