import React from 'react';
import { PriceCardContainer, PriceNameText, PriceText } from './styled';

type PriceCardProps = {
    name: string,
    text: string
}

const PriceCard = ({ name, text } : PriceCardProps) => (
  <PriceCardContainer>
    <PriceNameText>{name}</PriceNameText>
    <PriceText>
      {text}
    </PriceText>
  </PriceCardContainer>
);

export default PriceCard;
