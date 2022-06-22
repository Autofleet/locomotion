import { Text, View } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

export const Container = styled(View)`
height: 35px;
width: 85%;
shadow-offset: 0px 0px;
shadow-color: #04214f;
shadow-opacity: 0.4;
background-color: ${({ theme }) => theme.pageBackgroundColor};
border-radius: 8px;
`;

export const StreetAddress = styled(Text)`
${FONT_SIZES.MEDIUM}
${FONT_WEIGHTS.SEMI_BOLD}
`;
