import React from 'react';
import PriceCard from '../PriceCard';
import { NoTitlePriceCardContainer } from './styled';

const NoTitlePriceCard = (props:any) => (
  <NoTitlePriceCardContainer>
    <PriceCard {...props} />
  </NoTitlePriceCardContainer>
);

export default NoTitlePriceCard;
