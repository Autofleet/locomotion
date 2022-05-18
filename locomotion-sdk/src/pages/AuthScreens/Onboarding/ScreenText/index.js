import React from 'react';
import { SubText, Text, TextContainer } from './styles';

const ScreenText = ({ text, subText }) => (
  <TextContainer>
    <Text>
      {text}
    </Text>
    <SubText>
      {subText}
    </SubText>
  </TextContainer>
);

export default ScreenText;
