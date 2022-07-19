import { Text, View } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

export const CardContainer = styled(View)`
padding: 20px;
shadow-offset: 0px 10px;
shadow-color: #ededed;
shadow-opacity: 0.7;
shadow-radius: 10;
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
opacity: .7;
margin-top: 5px;
`;

export const DateContainer = styled(View)`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
`;
