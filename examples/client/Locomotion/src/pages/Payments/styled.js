import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import { Text } from '../Profile/ScreenText/styles';
import SvgIcon from '../../Components/SvgIcon';

import creditCardImage from '../../assets/menuItems/creditcard.png';

export const CreditFormText = styled.Text`
  color: #1e273d;
  font-size: 14px;
  text-align: left;
  padding-bottom: 20px;
`;

export const CardContainer = styled.View`
width: 100%;
height: 100%;
padding: 30px;
`;

export const PageContent = styled(View)`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`;

export const BalanceContainer = styled.View`
    flex: 1;
    flex-direction: row;
`;

export const BalanceTextContainer = styled.View`
    flex-direction: column;
    justify-content: center;
`;


export const BalanceTitle = styled.Text`
    color: #1e273d;
    font-size: 14px;
    text-align: center;
    font-weight: 700;
`;

export const BalanceText = styled.Text`
    color: #1e273d;
    font-size: 45px;
    text-align: center;
    font-weight: 700;
`;

export const CreditCardContainer = styled.TouchableOpacity`
    flex-direction: column;
    margin-right: 15px;
    margin-left: 15px;
    height: 100px;
`;

export const CreditCardRow = styled.View`
    background-color: #fff;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    max-height: 50px;
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
display: flex;
    margin: 25px;
    align-self: flex-end;
    padding: 5px;
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export const DeleteCreditCardText = styled.Text`
    color: ${'#f03a5f'};
    text-align: right;
`;

export const CardsListContainer = styled.View`
   flex: 1;
   flex-direction: column;
   justify-content: flex-start;
`;

export const PaymentMethodsContainer = styled.View`
    display: flex;
    max-height: 90%;
`;

export const CreditCardsContainer = styled.View`
display: flex;
flex-direction: row;
max-width: 70%;
`;

export const MethodCard = styled.View`
display: flex;
flex-direction: row;
justify-content: space-between;
`;

export const ChangeButton = styled(Text)`
padding-bottom: 5;
color: #24aaf2;
${FONT_SIZES.LARGE}
`;


export const PaymentCardContainer = styled.View`
  flex-direction: row;
  vertical-align: center;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px 0px;
  border-bottom-width: 1px;
  border-bottom-color: #e2e2e2;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
`;

export const BottomContainer = styled.View`
padding: 20px;
`;

export const TemporaryHoldView = styled.View`
padding: 10px;
background-color: #f8f8f8;
margin-left: 15px;
width: 90%;
`;

export const TemporaryHoldText = styled.Text`
${FONT_SIZES.MEDIUM};
${FONT_WEIGHTS.LIGHT}
`;

export const LearnMore = styled(Text)`
    ${FONT_SIZES.LARGE};
    ${FONT_WEIGHTS.BOLD}
    color: #24aaf2;
    text-decoration: underline;
    text-decoration-color: #24aaf2;
`;
