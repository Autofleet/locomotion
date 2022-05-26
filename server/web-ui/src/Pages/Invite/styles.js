import styled from "styled-components";

export const Container = styled.div`
height: 100vh;
width: 100vw;
background-color: #f1f2f6;
display: flex;
align-items: center;
justify-content: center;
`;

export const SuccessCard = styled.div`
margin: 0 auto;
background-color: #ffffff;
box-shadow: 0px 0px 10px #595959;
border-radius: 8px;
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;
padding: 35px;
width: 90%;
max-width: 400px;
height: 350px;
`;

export const Title = styled.div`
font-size: 40px;
font-weight: 800;
`;

export const SuccessText = styled.div`
font-size: 18px;
text-align: center;
`;

export const ContinueButton = styled.button`
background-color: #24aaf2;
text-align: center;
height: 50px;
width: 80%;
border-radius: 8px;
`;

export const ButtonText = styled.text`
color: #ffffff;
font-size: 18px;
line-height: 50px;
`;