import React from 'react';
import { PriceCardContainer, PriceNameText, PriceText } from './styled';

type PriceCardProps = {
    name: string,
    text: string
}

function PriceCard({ name, text } : PriceCardProps) {
  return (
    <PriceCardContainer>
      <PriceNameText>{name}</PriceNameText>
      <PriceText>
        {text}
      </PriceText>
    </PriceCardContainer>
  );
}

export default PriceCard;
