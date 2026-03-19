import React from 'react';
import { Container, TagText } from './styled';

function Tag({ text, containerStyles, textColor }) {
  return (
    <Container style={containerStyles}>
      <TagText numberOfLines={1} color={textColor}>
        {text}
      </TagText>
    </Container>
  );
}

export default Tag;
