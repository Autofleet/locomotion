import { Text, View } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../context/theme';

export const Container = styled(View)`
    align-self: flex-end;
    margin: 0 20px;
    padding: 10px;
    shadow-offset: 0px 0px;
    shadow-color: #04214f;
    shadow-opacity: 0.4;
    elevation: 3;
    background-color: ${({ theme }) => theme.pageBackgroundColor};
    border-radius: 8px;
`;

export const BodyText = styled(Text)`
    ${FONT_SIZES.MEDIUM};
    ${FONT_WEIGHTS.REGULAR};
`;
