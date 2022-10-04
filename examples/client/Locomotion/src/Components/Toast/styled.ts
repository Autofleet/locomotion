import { Image, Text, View } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES } from '../../context/theme';
import Button from '../Button';

export const ToastContainer = styled(Button)`
width: 92%;
margin: 0 4%;
border-left-width: 0;
min-height: 70px;
flex-direction: row;
background-color: #fff;
border-radius: 8px;
padding: 10px;
align-items: center;
`;

export const ToastImage = styled(Image)`
  width: 60px;
  height: 60px;
  margin-right: 10px;
`;

export const TextContainer = styled(View)`
flex: 1
`;

export const Header = styled(Text)`
${FONT_SIZES.H3}
padding: 5px 0;
`;

export const SubText = styled(Text)`
${FONT_SIZES.MEDIUM}
`;
