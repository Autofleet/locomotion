import { SafeAreaView } from 'react-native';
import styled from 'styled-components';

const ArrowIconSource = require('../../assets/arrowright.png');

export const DrawerIcon = styled.Image`
  width: 23px;
  height: 23px;
  margin-right: 20px;
  opacity: 0.6;
`;

export const Arrow = styled.Image.attrs({ source: ArrowIconSource })`
  opacity: 0.4;
  margin-right: 10px;
  margin-left: auto;
  width: 10px;
  height: 10px;

`;

export const LabelText = styled.Text`
  color: ${({ theme }) => theme.textColor};
  height: 30px;
  line-height: 30px;
`;

export const StyledSafeAreaView = styled(SafeAreaView)`
  background-color: ${({ theme }) => theme.pageBackgroundColor};
`;

export const StyledDrawerLabel = styled.TouchableOpacity`
  border-color: #dfdfdf;
  border-bottom-width: ${({ lastItem }) => (lastItem ? '0' : '1px')};
  padding: 30px 10px;
  width: 100%;
  flex-direction: row;
  flex: 1;
  background-color: ${({ theme, focused }) => (focused ? 'gray' : theme.pageBackgroundColor)};
  align-items: center;
`;
