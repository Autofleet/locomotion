import React from 'react';
import PriceCard from '../PriceCard';
import { NoTitlePriceCardContainer } from './styled';

function NoTitlePriceCard(props:any) {
  return (
    <NoTitlePriceCardContainer>
      <PriceCard {...props} />
    </NoTitlePriceCardContainer>
  );
}

export default NoTitlePriceCard;
