
import React, { useEffect, useState } from 'react';
import { SummaryStars, StarIcon } from './styled';
import Button from '../../Components/Button';

import starIconSource from '../../assets/star.png';

import lightStarIconSource from '../../assets/lightStar.png';


const Star = (props) => {
  const source = props.isOn ? lightStarIconSource : starIconSource;
  return (
    <Button noBackground {...props} data-test-id="RattingButton"><StarIcon source={source} isOn={props.isOn} /></Button>
  );
};

const StarRating = ({ onUpdate }) => {
  const [rating, setRating] = useState(null);

  const updateRating = async (rate) => {
    setRating(rate);
  };

  useEffect(() => {
    onUpdate(rating);
  }, [rating]);

  return (
    <SummaryStars>
      <Star isOn={rating >= 1} onPress={() => updateRating(1)} />
      <Star isOn={rating >= 2} onPress={() => updateRating(2)} />
      <Star isOn={rating >= 3} onPress={() => updateRating(3)} />
      <Star isOn={rating >= 4} onPress={() => updateRating(4)} />
      <Star isOn={rating >= 5} onPress={() => updateRating(5)} />
    </SummaryStars>
  );
};


export default StarRating;
