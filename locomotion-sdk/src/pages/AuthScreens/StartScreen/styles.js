import styled from "styled-components";
import Button from "../../../Components/Button";
const loginTextColor = '#7c8799';

export const PageContainer = styled.View`
align-items: center;
display: flex;
flex-direction: column;
flex: 1;
width: 100%;
padding: 30px;
`;
export const ButtonsContainer = styled.View`
display: flex;
flex-direction: column;
width: 100%;
margin-bottom: 50px;
`;

export const StartButton = styled(Button)`
height: 30px;
margin: 10px 0;
height: 50px;
border-radius: 30px;
background-color: ${({dark}) => dark ? 'grey' : 'white'};
color: ${({dark}) => dark ? 'white' : 'grey'};
${({dark}) => !dark && 'border: 1px solid grey'};
box-shadow: 0px 3px 3px grey;
`;

export const ButtonText = styled.Text`
margin: auto;
`;

export const TermsText = styled.Text`
  color: ${loginTextColor};
  font-size: 11px;
  text-align: center;
  width: 50%;
`;

export const TermsLink = styled.Text`
  font-size: 10px;
  text-align: center;
  font-weight: 500;
  color: #000000;
  padding: 2px;
  line-height: 16;

  &:active {
    color: red;
  }
`;

export const LogoContainer = styled.View`
flex: 1;
`;