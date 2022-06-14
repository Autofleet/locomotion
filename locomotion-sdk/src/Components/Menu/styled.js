import { SafeAreaView } from 'react-native';
import styled from 'styled-components';
import Button from '../Button';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

export const DrawerIcon = styled.Image`
  width: 23px;
  height: 23px;
  margin-right: 15px;
  opacity: 0.6;
`;

export const LabelText = styled.Text`
  color: ${({ theme }) => theme.textColor};
  height: 30px;
  line-height: 30px;
  ${FONT_SIZES.H2}
  ${({ focused }) => (focused ? FONT_WEIGHTS.SEMI_BOLD : FONT_WEIGHTS.REGULAR)};
`;

export const StyledSafeAreaView = styled(SafeAreaView)`
  background-color: ${({ theme }) => theme.pageBackgroundColor};
`;

export const StyledDrawerLabel = styled.TouchableOpacity`
  padding: 30px;
  width: 100%;
  flex-direction: row;
  flex: 1;
  align-items: center;
`;

export const HeaderLink = styled.TouchableOpacity`
`;

export const HeaderIconContainer = styled(Button).attrs({ noBg: true })`
  padding: 5px;
  position: absolute;
  top: 6px;
  right: 0;
`;

export const BaseHeaderText = styled.Text`
  font-weight: bold;
  padding: 5px;
`;

export const HeaderText = styled(BaseHeaderText)`
  color: ${({ theme }) => theme.primaryColor};
  ${FONT_SIZES.LARGE}
  ${FONT_WEIGHTS.REGULAR}
`;

export const HeaderMainText = styled(BaseHeaderText)`
  font-size: 22px;
  padding-top: 10px;
`;

export const Header = styled.View`
  padding: 15px 25px;
  width: 100%;
`;
