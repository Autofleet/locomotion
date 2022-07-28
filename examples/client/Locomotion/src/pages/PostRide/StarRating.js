
import React, { useEffect, useState } from 'react';
import { SummaryStars } from './styled';
import Stars from '../../Components/Stars';

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
      <Stars size={33} rating={rating} updateRating={updateRating} />
    </SummaryStars>
  );
};


export default StarRating;
