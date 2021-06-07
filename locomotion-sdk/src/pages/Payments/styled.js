
import { View, Text, Dimensions } from 'react-native'
import styled from 'styled-components';
const creditCardImage = require('../../assets/menuItems/creditcard.png');

const ERROR_COLOR = '#f03a5f';

export const PageContent = styled(View)`
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

`;

export const BalanceContainer = styled.View`
    flex: 1;
    flex-direction: row;
    background-color: red;
`

export const BalanceTextContainer = styled.View`
    flex-direction: column;
    justify-content: center;
`


export const BalanceTitle = styled.Text`
    color: #1e273d;
    font-size: 14px;
    text-align: center;
    font-weight: 700;
`

export const BalanceText = styled.Text`
    color: #1e273d;
    font-size: 45px;
    text-align: center;
    font-weight: 700;
`

export const CreditForm = styled.View`
    flex: 1;
`;

export const SubmitContainer = styled.View`
    max-width: 90%;
    justify-content: flex-end;
    align-self: center;
    margin-bottom: 30px;
    flex:1;
`;

export const CreditCardContainer = styled.View`
    flex-direction: column;
    flex:1;
    margin-right: 15px;
    margin-left: 15px;
`;

export const CreditCardRow = styled.View`
    background-color: #fff;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    max-height: 50px;
    margin-top: 15px;
    border-radius: 5px;
    shadow-opacity: 0.35;
    shadow-radius: 2px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    padding: 8px;
`;

export const CreditCardImage = styled.Image.attrs({ source: creditCardImage })`
    opacity: 0.4;
    width: 30px;
    height: 30px;
    align-self: center;
`;

export const CreditCardRowText = styled.Text`
    color: #1e273d;
    font-size: 20px;
    text-align: center;
    font-weight: 700;
    align-self: center;
`;

export const DeleteCreditCard = styled.TouchableOpacity`
    flex: 1;
    margin-top: 15px;
`;

export const DeleteCreditCardText = styled.Text`
    color: ${ERROR_COLOR};
    text-align: right;
`;

export const ErrorMessage = styled.Text`
    color: ${ERROR_COLOR}
`