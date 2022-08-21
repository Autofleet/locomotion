import { Text, View } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import Button from '../Button';

export const Container = styled(View)`
min-height: 40px;
width: 85%;
shadow-offset: 0px 0px;
shadow-color: #04214f;
shadow-opacity: 0.4;
elevation: 3;
background-color: ${({ theme }) => theme.pageBackgroundColor};
border-radius: 8px;
padding: 10px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
`;

export const StreetAddressContainer = styled(Button)`
  width: 40%;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
`;

export const StreetAddress = styled(Text).attrs({
  numberOfLines: 1,
})`
  ${FONT_SIZES.MEDIUM}
  ${FONT_WEIGHTS.REGULAR}
`;
