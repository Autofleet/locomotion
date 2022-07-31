import React from 'react';
import styled from 'styled-components';
import { View } from 'react-native';
import Button from '../Button';
import StarSvg from './star.svg';

const SummaryStars = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const StarIcon = styled(StarSvg).attrs((({
  isOn,
  theme,
  size,
}) => ({
  height: size,
  width: size,
  stroke: theme.primaryColor,
  fill: isOn ? theme.primaryColor : '#f9f9f9',
})))`
  margin: 3px;
  display: flex;
  height: 30px;
  width: 30px;
  opacity: .9;
`;

const Star = ({ onPress, isOn, size }) => (
  <Button
    noBackground
    data-test-id="RatingButton"
    onPress={onPress}
  >
    <StarIcon isOn={isOn} size={size} />
  </Button>
);

const StarRating = ({ rating, updateRating = newRating => null, size = 16 }) => (
  <SummaryStars>
    <Star size={size} isOn={rating >= 1} onPress={() => updateRating(1)} />
    <Star size={size} isOn={rating >= 2} onPress={() => updateRating(2)} />
    <Star size={size} isOn={rating >= 3} onPress={() => updateRating(3)} />
    <Star size={size} isOn={rating >= 4} onPress={() => updateRating(4)} />
    <Star size={size} isOn={rating >= 5} onPress={() => updateRating(5)} />
  </SummaryStars>
);

export default StarRating;
