import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import xIcon from '../../../../assets/x.png'
import Button from '../../../../Components/Button';

export const MessageContainer = styled.View`
    min-height: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    align-items: center;
    flex-direction: row;
    flex-direction: column;
`;


export const MessageTitle = styled.Text`
  font-size: 14px;
  color: #727272;
  font-weight: 500;
  margin-bottom: 15px;
  text-align: center;
`;

export const MessageText = styled.Text`
  font-size: 12;
  color: #727272;
  text-align: center;
  font-weight: 500;
`;

export const CloseContainer = styled(Button)`
    position: absolute;
    right: 15px;
    top: 15px;
    width: 13px;
    height: 13px;
`


export const ResetInputIcon = styled.Image.attrs({ source: xIcon })`
    display: flex;
    height: 13px;
    width: 13px;

`
