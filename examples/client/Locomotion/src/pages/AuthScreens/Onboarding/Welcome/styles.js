import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../context/theme';

export const WelcomeText = styled.Text`
font-size: 35px;
font-weight: 600;
margin: 10px 0;
text-align: center;
`;
export const WelcomeSubText = styled.Text`
${FONT_SIZES.LARGE};
${FONT_WEIGHTS.REGULAR};
margin: 10px 0;
text-align: center;
opacity: .6;
`;

export const PageContainer = styled.View`
flex: 1;
padding: 30px;
align-items: center;
`;

export const TextContainer = styled.View`
align-items: center;
`;
