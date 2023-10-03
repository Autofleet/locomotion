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

const NUM_OF_STARS = [1, 2, 3, 4, 5];
const Star = ({
  onPress, isOn, size,
}) => (
  <Button
    noBackground
    testID={`RatingButton${isOn ? '_on' : '_off'}`}
    onPress={onPress}
  >
    <StarIcon isOn={isOn} size={size} />
  </Button>
);

const StarRating = ({ rating, updateRating = newRating => null, size = 16 }) => (
  <SummaryStars>
    {NUM_OF_STARS.map(num => <Star num={num} size={size} isOn={rating >= num} onPress={() => updateRating(num)} />)}
  </SummaryStars>
);

export default StarRating;
