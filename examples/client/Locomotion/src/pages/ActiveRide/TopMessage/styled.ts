import { Text, View } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../context/theme';

export const Container = styled(View)`
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

export const Title = styled(View)`
    flex-direction: row;
    padding-bottom: 5px;
    align-items: center;
`;

export const TitleText = styled(Text)`
    ${FONT_SIZES.LARGE};
    ${FONT_WEIGHTS.BOLD};
`;

export const ButtonContainer = styled(View)`
    align-items: flex-end;
    margin-top: 10px;
    height: 15px;
`;

export const ButtonText = styled(Text)`
   color: #24aaf2
   ${FONT_SIZES.LARGE};
   ${FONT_WEIGHTS.SEMI_BOLD};
   margin-bottom: -10px;
`;
