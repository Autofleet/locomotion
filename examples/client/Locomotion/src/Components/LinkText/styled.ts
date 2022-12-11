import { TextInput, Text } from 'react-native';
import styled from 'styled-components/native';
import {
  FONT_SIZES, FONT_SIZES_VALUES, FONT_WEIGHTS, convertHextToRgba, LINK_BLUE_COLOR,
} from '../../context/theme';

import SvgIcon from '../SvgIcon';

interface MarkerProps {
    theme?: any;
    width?: number;
    height?: number;
    icon: any;
    iconSide: 'left' | 'right';
}

const isLeft = side => side === 'left';
export const Container = styled.View`
    display: flex;
    flex-direction: ${({ iconSide }) => (isLeft(iconSide) ? 'row' : 'row-reverse')};
    justify-content: ${({ iconSide }) => (isLeft(iconSide) ? 'flex-start' : 'flex-end')};
    align-items: center;

`;


export const LinkText = styled(Text)`
    ${FONT_SIZES.LARGE};
    ${FONT_WEIGHTS.SEMI_REGULAR};
    color: ${LINK_BLUE_COLOR};
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
    ${({ iconSide }) => (isLeft(iconSide) ? 'margin-right: 5px' : 'margin-left: 5px')};
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
`;
