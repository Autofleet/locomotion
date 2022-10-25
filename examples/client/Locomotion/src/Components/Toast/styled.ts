import {
  Image, Text, View, TouchableOpacity,
} from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import Button from '../Button';


export const ToastContainer = styled(Button)`
  width: 92%;
  margin: 0 4%;
  min-height: 70px;
  background-color: #fff;
  border-radius: 8px;
  padding: 10px 16px;
  shadow-offset: 0px 0px;
  shadow-color: #000;
  shadow-opacity: 0.4;
  elevation: 6;
  flex-direction: column;
`;

export const IconContainer = styled(Button)`
  align-self: flex-end;
`;

export const ContentContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;

export const ToastImage = styled(Image)`
  width: 60px;
  height: 60px;
  margin-right: 10px;
`;

export const TextContainer = styled(View)`
  flex: 1;
`;

export const Header = styled(Text)`
  ${FONT_SIZES.H3}
  ${FONT_WEIGHTS.MEDIUM}
`;

export const SubText = styled(Text)`
  ${FONT_SIZES.LARGE}
  padding: 8px 0px;
`;

export const Footer = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
`;

export const FooterButton = styled(TouchableOpacity)`

`;


export const FooterButtonText = styled(Text)`
  ${FONT_SIZES.LARGE}
  ${FONT_WEIGHTS.SEMI_BOLD}
  color: ${({ theme }) => theme.primaryColor};
`;
