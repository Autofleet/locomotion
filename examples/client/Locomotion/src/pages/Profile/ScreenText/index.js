import React from 'react';
import propsTypes from 'prop-types';
import { SubText, Text, TextContainer } from './styles';

const ScreenText = ({ text, subText }) => (
  <TextContainer hasSubText={!!subText}>
    <Text>
      {text}
    </Text>
    {subText && (
    <SubText>
      {subText}
    </SubText>
    )}
  </TextContainer>
);

ScreenText.propTypes = {
  text: propsTypes.string.isRequired,
  subText: propsTypes.string,
};

ScreenText.defaultProps = {
  subText: null,
};

export default ScreenText;
