import styled from 'styled-components/native';

type ThemeProp = {
    theme: any;
}
type CardContainerProps = {
    selected: boolean;
    theme: any;
}
export const CardContainer = styled.View<CardContainerProps>`
width: 100%;
height: 70px;
border-radius: 8px;
border: ${({selected, theme}) => selected ? `2px solid ${theme.primaryColor}` : 'none'};
display: flex;
flex-direction: row;
padding: 5px;
`;

export const CarIcon = styled.Image`
width: 20%;
height: 100%;
`;

export const ServiceDetails = styled.View`
width: 80%;
height: 100%;
display: flex;
flex-direction: column;
justify-content: center;
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
height: 15px;
`

export const Title = styled.Text`
font-size: 20px;
`

export const Tag = styled.View<ThemeProp>`
background-color: ${({theme}) => theme.primaryColor};
border-radius: 8px;
padding: 2px 8px;
`

export const TagText = styled.Text<ThemeProp>`
font-size: 12px;
color: white;
`

export const Price = styled.Text`
font-size: 20px;

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
font-size: 12px;
`