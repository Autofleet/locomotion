import React from 'react';
import { BodyText, Container } from './styled';

const TopMessage = ({
  text,
}: {
    text: string
}) => (
  text
    ? (
      <Container>
        <BodyText>
          {text}
        </BodyText>
      </Container>
    )
    : null
);

export default TopMessage;
