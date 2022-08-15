import React from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';
import styled from 'styled-components';
import RoundedButton from '../../Components/RoundedButton';
import xIcon from '../../assets/x.png';

export const PopupContainer = styled.View`
  padding: 20px 0;
  min-height: 250px;
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  border-color: rgba(0, 0, 0, 0.1);
`;

export const SummaryTitle = styled.Text`
  font-size: 20px;
  color: black;
  font-weight: 500;
  text-align: center;
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

export const SubmitContainer = styled.View`
  align-self: flex-end;
  justify-content: space-between;
  height: 90px;
`;

export const ContentContainer = styled.View`
  max-width: 80%;
  flex-direction: column;
  justify-content: space-between;
`;

export const Content = styled.Text`
  font-size: 16px;
  padding: 15px 0;
`;
