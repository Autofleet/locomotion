import { Text, View } from 'react-native';
import styled from 'styled-components';
import CloseButton from '../../Components/CloseButton';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

export const StyledCloseButton = styled(CloseButton)`
align-self: flex-end;
margin-bottom: 5;
`;

export const OuterContainer = styled(View)`
display: flex;
flex-direction: column;
justify-content: space-evenly;
background-color: #ffffff;
border-radius: 8px;
`;

export const InnerContainer = styled(View)`
display: flex;
flex-direction: column;
justify-content: space-evenly;
padding: 16px;
`;

export const EstimatedTextContainer = styled(View)`
background-color: #f8f8f8;
align-items: center;
padding: 8px;
border-radius: 4px;
margin: 10px 0;
`;

export const EstimatedText = styled(Text)`
text-align: center;
${FONT_SIZES.SMALL}
${FONT_WEIGHTS.LIGHT}
opacity: .7;
`;

export const Line = styled(View)`
border: .5px solid #e6e6e6;
width: 100%;
margin: 0 5px;
`;

export const Title = styled(Text)`
${FONT_SIZES.MEDIUM}
${FONT_WEIGHTS.SEMI_BOLD}
padding: 8px 0;
`;

export const Row = styled(View)`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding: 8px 16px;
`;

export const ItemText = styled(Text)`
${FONT_SIZES.MEDIUM}
${FONT_WEIGHTS.LIGHT}
opacity: .7;
`;

export const CenteredItemText = styled(ItemText)`
text-align: center;
margin: 10px;
`;
