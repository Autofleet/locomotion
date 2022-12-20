import styled from 'styled-components';
import { Text, View } from 'react-native';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import Button from '../../Components/Button';

export const Container = styled(View)`
background-color: #ffffff;
border-radius: 8px;
padding: 20px;
`;

export const TitleContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
`;

export const LeftSideTitle = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-start;
`;

export const RightSideTitle = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-end;
`;

export const ButtonText = styled(Text)`
${FONT_SIZES.H3}
${FONT_WEIGHTS.REGULAR}
color: ${({ theme }) => theme.primaryButtonTextColor}
`;

export const TextContainer = styled(View)`
width: 90%;
opacity: .8;
padding: 15px 0;
`;

export const CloseButton = styled(Button)`
width: 135px;
height: 45px;
display: flex;
justify-content: center;
align-items: center;
border-radius: 8px;
align-self: center;
margin-top: 10px;
`;
