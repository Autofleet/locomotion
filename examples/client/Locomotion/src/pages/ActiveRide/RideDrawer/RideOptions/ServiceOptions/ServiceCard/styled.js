import { Platform } from 'react-native';
import styled from 'styled-components';
import Button from '../../../../../../Components/Button';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../../context/theme';

export const TitleContainer = styled.View`
display: flex;
flex-direction: row;
`;
export const CardContainer = styled(Button)`
width: 100%;
min-height: 75px;
border-radius: 8px;
border: ${({ selected, theme, withBorder }) => (withBorder ? selected ? `2px solid ${theme.primaryColor}` : '2px solid white' : 'none')};
display: flex;
flex-direction: row;
padding: 5px;
background-color: #ffffff;
${({ selected, withBorder }) => (withBorder && selected && 'box-shadow: 0 0 4px #211c1c1c')};
`;

export const CarContainer = styled.View`
width: 20%;
opacity: ${({ unavailable }) => (unavailable ? 0.4 : 1)};
`;

export const CarIcon = styled.Image`
flex: 1;
`;

export const ServiceDetails = styled.View`
width: 80%;
display: flex;
flex-direction: column;
justify-content: center;
opacity: ${({ unavailable }) => (unavailable ? 0.4 : 1)};
`;

export const Row = styled.View`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: flex-start;
width: 100%;
`;

export const Title = styled.Text`
${FONT_SIZES.H3};
${FONT_WEIGHTS.MEDIUM};
margin-right: 5px;
`;

export const Price = styled.Text`
${FONT_SIZES.LARGE};
${FONT_WEIGHTS.MEDIUM};
`;

export const TimeDetails = styled.View`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

export const Eta = styled.Text`
opacity: .5;
${FONT_SIZES.LARGE}
`;

export const Capacity = styled.View`
display: flex;
flex-direction: row;
align-items: center;
`;

export const Circle = styled.View`
background-color: #333333;
opacity: .5;
border-radius: 2px;
width: 2px;
height: 2px;
margin: 5px;
`;

export const AvailableSeats = styled.Text`

`;
export const Description = styled.Text`
opacity: .5;
${FONT_SIZES.MEDIUM};
${FONT_WEIGHTS.REGULAR};
width: 90%;
`;

export const EstimatedText = styled.Text`
color: #707070;
${FONT_SIZES.MEDIUM};
${FONT_WEIGHTS.REGULAR};
`;

export const PriceContainer = styled.View`
flex-direction: column;
`;
