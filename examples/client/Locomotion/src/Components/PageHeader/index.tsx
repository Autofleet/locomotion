import React from 'react';
import propsTypes from 'prop-types';
import { Platform, View } from 'react-native';
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
        <HeaderIconContainer side={iconSide} onPress={onIconPress} data-test-id="NavigationPanelButton">
          <HeaderIcon width={width} height={width} source={icon} side={iconSide} />
        </HeaderIconContainer>
      ) : <View />}
    <HeaderText>{title}</HeaderText>
    {showSkipButton
      && (
      <SkipButton
        testID="skipButton"
        noBackground
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
