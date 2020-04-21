import React from 'react';
import styled from 'styled-components';
import xIcon from '../../assets/x.png'

export const Container = styled.View`
  padding: 20px 0;
  min-height: 200;
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 2;
  border-color: rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: black;
  font-weight: 500;
  margin-bottom: 15px;
  text-align: center;
`;

export const SubTitle = styled.Text`
  text-align: center;
  color: #727272;
  font-size: 12;
  font-weight: 500;
  padding-top: 20px;
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