import styled from "styled-components";
import Button from "../../../../Components/Button";

export const ButtonsContainer = styled.View`
display: flex;
flex-direction: row;
width: 100%;
justify-content: space-between;
`;

export const NavButton = styled(Button)`
width: 100px;
height: 50px;
border: 1px solid black;
`; 

export const ButtonText = styled.Text`
margin: auto;
`;