import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import LottieView from 'lottie-react-native';

const creditCardImage = require('../../assets/menuItems/creditcard.png');
const darkLoader = require('../../assets/loaders/dark-loader.json');

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

export const CreditCardImage = styled.Image.attrs({source: creditCardImage})`
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
  margin-top: 5px;
  align-self: flex-end;
  padding: 5px;
  opacity: ${({disabled}) => (disabled ? 0.5 : 1)};
`;

export const DeleteCreditCardText = styled.Text`
  color: ${'#f03a5f'};
  text-align: right;
`;

const FullPageLoaderWrapper = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${({theme}) => theme.pageBackgroundColor};
  position: absolute;
  z-index: 99999;
`;

const LoaderContainer = styled.View`
  align-self: center;
  position: absolute;
  top: 50%;
  margin-top: -8px;
`;

export const FullPageLoader = props => (
  <FullPageLoaderWrapper>
    <LoaderContainer>
      <LottieView
        style={{
          width: 15,
          height: 15,
        }}
        source={darkLoader}
        {...props}
      />
    </LoaderContainer>
  </FullPageLoaderWrapper>
);

export const CardsListContainer = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
`;
