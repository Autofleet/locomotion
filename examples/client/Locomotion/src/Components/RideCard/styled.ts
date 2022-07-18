import { Text, View } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

export const CardContainer = styled(View)`
padding: 20px;
shadow-offset: 0px 10px;
shadow-color: #04214f;
shadow-opacity: 0.1;
shadow-radius: 5;
background-color: #ffffff;
margin-bottom: 20px;
`;

export const RideDate = styled(Text)`
${FONT_SIZES.H3}
${FONT_WEIGHTS.MEDIUM}
`;

export const ServiceType = styled(Text)`
${FONT_SIZES.MEDIUM}
${FONT_WEIGHTS.LIGHT}
`;
