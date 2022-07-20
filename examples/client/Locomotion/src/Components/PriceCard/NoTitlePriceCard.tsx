import React from 'react';
import { View } from 'react-native';
import PriceCard from '../PriceCard';

const NoTitlePriceCard = (props:any) => (
  <View style={{ marginLeft: 15 }}>
    <PriceCard {...props} />
  </View>
);

export default NoTitlePriceCard;
