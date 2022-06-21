import React from 'react';
import {
  View, Text, Image, TouchableOpacity,
} from 'react-native';
import styled from 'styled-components';
import { TextArea } from '../../Components/TextArea';
import { End } from '../../lib/text-direction';

export const SummaryContainer = styled.View`
  padding: 20px 0;
  height: 298;
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
`;

export const Counter = styled.Text`
  font-size: 16px;
  line-hight: 20px;
  margin-top: 4px;
  color: #1a303b56;
  margin-bottom: 15px;
  text-align: ${End};
`;

export const StyledTextArea = styled(TextArea)`
  margin-bottom: 20px;
`;
