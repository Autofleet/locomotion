import React from 'react';
import { View } from 'react-native';
import { SubText } from '../../pages/Profile/ScreenText/styles';

type PriceCardProps = {
    name: string,
    text: string
}

const PriceCard = ({ name, text } : PriceCardProps) => (
  <View style={{ flexDirection: 'row', width: '100%', marginBottom: 5 }}>
    <SubText style={{ width: '80%' }}>{name}</SubText>
    <SubText style={{ textAlign: 'right', width: '30%' }}>
      {text}
    </SubText>
  </View>
);

export default PriceCard;
