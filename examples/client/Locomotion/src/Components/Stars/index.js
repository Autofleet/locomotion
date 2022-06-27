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
  height = '16px',
  width = '16px',
}) => ({
  height,
  width,
  stroke: 'red',
  fill: isOn ? theme.primaryColor : theme.pageBackgroundColor,
})))`
  margin: 3px;
  display: flex;
  height: 30px;
  width: 30px;
`;

const Star = ({ onPress, isOn }) => (
  <Button
    noBackground
    data-test-id="RatingButton"
    onPress={onPress}
  >
    <StarIcon isOn={isOn} />
  </Button>
);

const StarRating = ({ rating, updateRating = newRating => null }) => (
  <SummaryStars>
    <Star isOn={rating >= 1} onPress={() => updateRating(1)} />
    <Star isOn={rating >= 2} onPress={() => updateRating(2)} />
    <Star isOn={rating >= 3} onPress={() => updateRating(3)} />
    <Star isOn={rating >= 4} onPress={() => updateRating(4)} />
    <Star isOn={rating >= 5} onPress={() => updateRating(5)} />
  </SummaryStars>
);

export default StarRating;
