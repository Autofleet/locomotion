
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
  const starsArray = [1, 2, 3, 4, 5];
  const [rating, setRating] = useState(null);

  const updateRating = async (rate) => {
    setRating(rate);
  };

  useEffect(() => {
    onUpdate(rating);
  }, [rating]);

  return (
    <SummaryStars>
      {starsArray.map(starValue => (<Star isOn={rating >= starValue} onPress={() => updateRating(starValue)} />))}
    </SummaryStars>
  );
};


export default StarRating;
