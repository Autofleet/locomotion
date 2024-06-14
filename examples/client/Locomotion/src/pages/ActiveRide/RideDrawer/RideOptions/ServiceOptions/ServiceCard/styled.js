import styled from 'styled-components';
import Button from '../../../../../../Components/Button';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../../context/theme';

const UNAVAILABLE_OPACITY = 0.56;

export const TitleContainer = styled.View`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
flex-grow: 1;
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
opacity: ${({ unavailable }) => (unavailable ? UNAVAILABLE_OPACITY : 1)};
`;

export const CarIcon = styled.Image`
flex: 1;
`;

export const ServiceDetails = styled.View`
width: 80%;
display: flex;
flex-direction: column;
justify-content: center;
opacity: ${({ unavailable }) => (unavailable ? UNAVAILABLE_OPACITY : 1)};
`;

export const Row = styled.View`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: flex-start;
width: 100%;
`;

export const WrapRow = styled(Row)`
flex-wrap: wrap;
align-items: center;
`;

export const Title = styled.Text`
${FONT_SIZES.H3};
${FONT_WEIGHTS.MEDIUM};
opacity: ${({ unavailable }) => (unavailable ? UNAVAILABLE_OPACITY : 1)};
color: #101010;
margin-right: 5px;
`;

export const Price = styled.Text`
    ${FONT_SIZES.LARGE};
    ${FONT_WEIGHTS.MEDIUM};
    color: ${({ unavailable }) => (unavailable ? '#7F7F7F' : '#101010')};
    text-align: right;
`;

export const TimeDetails = styled.View`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

export const HighEta = styled.Text`
color: ${({ theme }) => theme.primaryColor};
font-weight: bold;
${FONT_SIZES.LARGE}
`;

export const Eta = styled.Text`
${FONT_SIZES.LARGE}
color: #101010;
`;

export const Capacity = styled.View`
display: flex;
flex-direction: row;
align-items: center;
`;

export const Circle = styled.View`
background-color: #101010;
border-radius: 2px;
width: 2px;
height: 2px;
margin: 5px;
`;

export const AvailableSeats = styled.Text`
color: #101010;

`;
export const Description = styled.Text`
${FONT_SIZES.MEDIUM};
${FONT_WEIGHTS.REGULAR};
width: 85%;
color: #101010;
`;

export const EstimatedText = styled.Text`
color: #101010;
${FONT_SIZES.MEDIUM};
${FONT_WEIGHTS.REGULAR};
`;

export const PriceContainer = styled.View`
flex-direction: column;
`;
