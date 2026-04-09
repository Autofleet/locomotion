import React from 'react';
import { Container, TagText } from './styled';

const Tag = ({ text, containerStyles, textColor }) => (
  <Container style={containerStyles}>
    <TagText numberOfLines={1} color={textColor}>
      {text}
    </TagText>
  </Container>
);

export default Tag;
