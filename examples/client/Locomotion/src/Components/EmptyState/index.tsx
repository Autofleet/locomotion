import React from 'react';
import {
  Container, Description, Title, TitleWithoutDescription,
} from './styled';

interface EmptyStateProps {
    title: string;
    description?: string;
}
function EmptyState({
  title,
  description = '',
}: EmptyStateProps) {
  return (
    <Container>
      {description
        ? <Title>{title}</Title>
        : <TitleWithoutDescription>{title}</TitleWithoutDescription>}

      {description ? <Description>{description}</Description> : null}
    </Container>
  );
}
export default EmptyState;
