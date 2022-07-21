import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../context/theme';

export const TextContainer = styled.View`
display: flex;
flex-direction: column;
margin-bottom: 40px;
`;

export const Text = styled.Text`
${FONT_SIZES.H3};
${FONT_WEIGHTS.SEMI_BOLD};
margin: 5px 0;
`;

export const SubText = styled.Text`
${FONT_SIZES.LARGE};
${FONT_WEIGHTS.REGULAR};
opacity: .8;
`;
