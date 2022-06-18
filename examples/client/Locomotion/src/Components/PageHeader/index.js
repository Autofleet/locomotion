import React from 'react';
import propsTypes from 'prop-types';
import {View} from 'react-native';
import {
  Header,
  HeaderText,
  HeaderIconContainer,
  HeaderIcon,
  SkipButton,
  SkipButtonText,
} from './styled';
import i18n from '../../I18n';
import backArrow from '../../assets/arrow-back.png';

const PageHeader = ({
  title,
  icon,
  onIconPress,
  iconSide,
  displayIcon,
  width,
  showSkipButton,
  onPressSkip,
}) => (
  <Header>
    {displayIcon !== false ? (
      <HeaderIconContainer
        side={iconSide}
        onPress={onIconPress}
        data-test-id="NavigationPanelButton">
        <HeaderIcon
          width={width}
          height={width}
          source={icon}
          side={iconSide}
        />
      </HeaderIconContainer>
    ) : (
      <View />
    )}
    <HeaderText>{title}</HeaderText>
    {showSkipButton && (
      <SkipButton noBg onPress={onPressSkip}>
        <SkipButtonText>{i18n.t('general.skip')}</SkipButtonText>
      </SkipButton>
    )}
  </Header>
);

export default PageHeader;

PageHeader.defaultProps = {
  title: '',
  icon: backArrow,
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
