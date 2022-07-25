import React from 'react';
import { View } from 'react-native';
import { SubText } from '../../pages/Profile/ScreenText/styles';

type PriceCardProps = {
    name: string,
    text: string
}

const PriceCard = ({ name, text } : PriceCardProps) => (
  <View style={{
    flexDirection: 'row', marginVertical: 5, marginLeft: 15, width: '100%', justifyContent: 'space-between',
  }}
  >
    <SubText>{name}</SubText>
    <SubText style={{ textAlign: 'right' }}>
      {text}
    </SubText>
  </View>
);

export default PriceCard;
