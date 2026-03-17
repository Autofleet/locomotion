import React from 'react';
import { TextInput, Text } from 'react-native';
import styled from 'styled-components/native';
import {
  FONT_SIZES, FONT_SIZES_VALUES, FONT_WEIGHTS, convertHextToRgba, LINK_BLUE_COLOR,
} from '../../context/theme';

import SvgIcon from '../SvgIcon';

interface MarkerProps {
    theme?: Record<string, unknown>;
    width?: number;
    height?: number;
    icon: React.FC;
    iconSide: IconSide;
}

type IconSide = 'left' | 'right';

const isLeft = (side: IconSide) => side === 'left';

interface ContainerProps {
    iconSide: IconSide;
}

export const Container = styled.View<ContainerProps>`
    display: flex;
    flex-direction: ${({ iconSide }: ContainerProps) => (isLeft(iconSide) ? 'row' : 'row-reverse')};
    justify-content: ${({ iconSide }: ContainerProps) => (isLeft(iconSide) ? 'flex-start' : 'flex-end')};
    align-items: center;

`;

export const LinkText = styled(Text)`
    ${FONT_SIZES.LARGE};
    ${FONT_WEIGHTS.SEMI_REGULAR};
    color: ${LINK_BLUE_COLOR};
`;

export const TouchableContainer = styled.TouchableOpacity`
  flex: 1;
`;

export const StyledIcon = styled(SvgIcon).attrs(({
  theme,
  icon,
  width = 24,
  height = 24,
  iconSide,
}:MarkerProps) => ({
  Svg: icon,
  width,
  height,
  fill: LINK_BLUE_COLOR,
}))`
    ${({ iconSide }: MarkerProps) => (isLeft(iconSide) ? 'margin-right: 5px' : 'margin-left: 5px')};
    width: ${({ width }: MarkerProps) => width}px;
    height: ${({ height }: MarkerProps) => height}px;
`;
