import React from 'react';
import propsTypes from 'prop-types';
import { SubText, Text, TextContainer } from './styles';

const ScreenText = (props) => {
  const { text, subText = null } = props;
  return (
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
};

ScreenText.propTypes = {
  text: propsTypes.string.isRequired,
  subText: propsTypes.string,
};

export default ScreenText;
