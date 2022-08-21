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
