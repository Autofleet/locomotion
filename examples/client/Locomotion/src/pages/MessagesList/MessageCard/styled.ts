import { Text, View } from 'react-native';
import styled from 'styled-components';
import Button from '../../../Components/Button';
import { FONT_SIZES, FONT_WEIGHTS, LINK_BLUE_COLOR } from '../../../context/theme';

type CardContainerProps = {
    isRead: boolean
}
export const CardContainer = styled(Button)<CardContainerProps>`
max-height: 200px;
width: 100%;
padding: 20px;
display: flex;
flex-direction: row;
align-items: flex-start;
background-color: ${({ isRead }) => (isRead ? '#f9f9f9' : '#ffffff')};
border-width: 1px;
border-color: #e2e2e2;
`;

export const MessageTitle = styled(Text)`
${FONT_SIZES.H1}
${FONT_WEIGHTS.SEMI_BOLD}
`;

export const MessageText = styled(Text)`
${FONT_SIZES.H3}
${FONT_WEIGHTS.REGULAR}
opacity: .8;
margin: 10px 0;
`;

export const MessageFooter = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

export const MessageDate = styled(Text)`
${FONT_SIZES.MEDIUM}
${FONT_WEIGHTS.REGULAR}
opacity: .5;
padding: 5px 0;
`;

export const ReadMore = styled(Text)`

`;

export const ReadMoreText = styled(Text)`
${FONT_SIZES.LARGE}
${FONT_WEIGHTS.BOLD}
color: ${LINK_BLUE_COLOR};
`;

export const TextContainer = styled(View)`
width: 90%;
padding-right: 20px;
`;

export const ReadSymbolContainer = styled(View)`
width: 10%;
margin-top: 10px;
align-items: flex-start;
`;

export const ReadSymbol = styled(View)`
height: 10px;
width: 10px;
background-color: ${LINK_BLUE_COLOR};
border-radius: 100px;
`;
