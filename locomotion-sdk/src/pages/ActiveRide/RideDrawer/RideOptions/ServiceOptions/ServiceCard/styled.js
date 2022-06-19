import Button from '../../../../../../Components/Button';
import styled from 'styled-components/native';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../../context/theme';

export const CardContainer = styled(Button)`
width: 100%;
height: 70px;
border-radius: 8px;
border: ${({selected, theme}) => selected ? `2px solid ${theme.primaryColor}` : 'none'};
display: flex;
flex-direction: row;
padding: 5px;
`;

export const CarContainer = styled.View`
width: 20%;
height: 100%;
padding: 5px;
`;

export const CarIcon = styled.Image`
width: 100%;
height: 100%;
`;

export const ServiceDetails = styled.View`
width: 80%;
height: 100%;
display: flex;
flex-direction: column;
justify-content: center;
opacity: ${({unavailable}) => unavailable ? .4 : 1};
`

export const TopRow = styled.View`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
width: 100%;
`

export const Row = styled.View`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
width: 100%;
height: 16px;
`

export const Title = styled.Text`
${FONT_SIZES.H3};
${FONT_WEIGHTS.MEDIUM};
`

export const Price = styled.Text`
${FONT_SIZES.LARGE};
${FONT_WEIGHTS.MEDIUM};
`

export const TimeDetails = styled.View`
display: flex;
flex-direction: row;
width: 100px;
justify-content: space-between;
align-items: center;
`

export const Eta = styled.Text`
opacity: .5;
`

export const Capacity = styled.View`
display: flex;
flex-direction: row;
align-items: center;
`

export const Circle = styled.View`
background-color: #333333;
opacity: .5;
border-radius: 2px;
width: 2px;
height: 2px;
margin: 5px;
`;

export const AvailableSeats = styled.Text`

`
export const Description = styled.Text`
opacity: .5;
${FONT_SIZES.MEDIUM};
${FONT_WEIGHTS.REGULAR};
`