import React from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';
import styled from 'styled-components';
import xIcon from '../../assets/x.png';
import Button from '../../Components/Button';


export const SummaryStarsTitle = styled.Text`
  font-size: 20px;
  color: black;
  font-weight: 500;
  margin-bottom: 25px;
  text-align: center;
`;

export const SummaryStars = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 45px;
  justify-content: center;
  margin-bottom: 10px;
`;

export const StarIcon = styled.Image(({ isOn, theme }) => `
  padding: 10px 20px;
  display: flex;
  height: 30px;
  width: 30px;
  ${isOn ? `
    tint-color: ${theme.primaryColor};
  ` : `
    opacity: 0.4;
  `}
`);

export const PageContent = styled(View)`
    width: 100%;
    height: 100%;
`;


export const RatingContainer = styled(View)`
  margin-top: 30px;
  border-bottom-width: 1px ;
  border-bottom-color: #e2e2e2;
`;


export const TipsContainer = styled(View)`
  padding: 30px;
`;
