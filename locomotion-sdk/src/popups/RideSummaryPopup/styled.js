import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import xIcon from '../../assets/x.png'

export const SummaryContainer = styled.View`
  padding: 20px 0;
  height: 510;
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 2;
  border-color: rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const SummaryTitle = styled.Text`
  font-size: 20px;
  color: black;
  font-weight: 500;
  margin-bottom: 15px;
  text-align: center;
`;

export const SummarySubTitle = styled.Text`
  text-align: center;
  color: #727272;
  font-size: 12;
  font-weight: 500;
  padding-top: 20px
  padding-bottom: 15px;
`;

export const CloseContainer = styled.TouchableOpacity`
    position: absolute;
    right: 15px;
    top: 15px;
    width: 13px;
    height: 13px;
`;

export const ResetInputIcon = styled.Image.attrs({ source: xIcon })`
    display: flex;
    height: 13px;
    width: 13px;
`;

export const SummaryItems = styled.View`
  height: 190;
  padding-bottom: 40px
`;

export const SummaryItem = styled.View(props => `
  border-color: #ededed;
  border-bottom-width: ${props.last ? 0 : 1}px;
  width: 100%;
  flex-direction: row;
  flex: 1;
  padding-top: 15px;
  padding-right: 20px;
  padding-left: 20px;
`);

export const SummaryItemIcon = styled.Image`
  width: 23px;
  height: 23px;
  margin-right: 20px;
  opacity: 0.9;
`;

export const SummaryItemTitle = styled.Text`
  color: #4A83C2;
  margin-top: 4px;
  font-size: 12;
  font-weight: 500;
`;

export const SummaryItemText = styled.Text`
  margin-left: auto;
  margin-top: 4px;
  opacity: 0.6;
  font-size: 12;
  font-weight: 300;
`;

export const SummaryStarsTitle = styled.Text`
  font-size: 20px;
  color: black;
  font-weight: 500;
  margin-bottom: 15px;
  text-align: center;
`;

export const SummaryStarsSubTitle = styled.Text`
  text-align: center;
  color: #727272;
  font-size: 14;
  font-weight: 400;
  padding-top: 20px;

`;

export const SummaryStars = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 45px;
  justify-content: center;
`;

export const StarIcon = styled.Image(({isOn}) => `
  padding: 10px 20px;
  display: flex;
  height: 30px;
  width: 30px;
  opacity: ${isOn ? null : 0.4};
`);

