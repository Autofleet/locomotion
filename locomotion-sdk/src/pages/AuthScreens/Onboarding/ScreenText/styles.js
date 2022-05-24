import styled from 'styled-components';
import { FONT_STYLES } from '../../../../services/sharedStyles';

export const TextContainer = styled.View`
display: flex;
flex-direction: column;
margin-bottom: 40px;
`;

export const Text = styled.Text`
font-size: ${FONT_STYLES.SIZE.LARGE};
font-weight: 500;
margin: 5px 0;
`;

export const SubText = styled.Text`
font-size: ${FONT_STYLES.SIZE.MEDIUM};
opacity: .6;
`;
