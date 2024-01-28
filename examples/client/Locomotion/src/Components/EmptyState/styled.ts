import { Text, View } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

export const Container = styled(View)`
border-radius: 8px;
border: 1px dashed rgba(125, 139, 172, 0.32);
display: flex;
padding: 16px;
flex-direction: column;
justify-content: center;
align-items: center;
margin: 4px;
flex: 1 0 0;
align-self: stretch;
`;
export const Title = styled(Text)`
align-self: stretch;
color: #212229;
text-align: center;
${FONT_WEIGHTS.REGULAR};
${FONT_SIZES.LARGE};
font-weight: 600;
`;
export const Description = styled(Text)`
align-self: stretch;
color: #666975;
text-align: center;
${FONT_WEIGHTS.REGULAR};
${FONT_SIZES.LARGE};
font-weight: 400;
`;
export const TitleWithoutDescription = styled(Text)`
align-self: stretch;
color: #666975;
text-align: center;
${FONT_WEIGHTS.REGULAR};
${FONT_SIZES.LARGE};
font-weight: 500;
`;
