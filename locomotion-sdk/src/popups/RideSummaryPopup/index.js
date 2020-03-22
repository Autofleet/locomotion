import React, {Fragment, useEffect, useState} from 'react';
import { View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import {
  SummaryContainer,
  SummarySubTitle,
  SummaryTitle,
  CloseContainer,
  ResetInputIcon,
  SummaryItems,
  SummaryItem,
  SummaryItemIcon,
  SummaryItemTitle,
  SummaryItemText,
  SummaryStarsSubTitle,
  SummaryStarsTitle,
  SummaryStars,
  StarIcon
} from './styled'
import { getTogglePopupsState } from '../../context/main';
const starIconSource = require('../../assets/star.png');
const lightStarIconSource = require('../../assets/lightStar.png');
const durationIconSource = require('../../assets/duration.png');
const distanceIconSource = require('../../assets/distance.png');
const priceIconSource = require('../../assets/price.png');

export default ({
                  closeAfter, onClose,
                }) => {
  const [rating, setRating] = useState(false);
  const [isPopupOpen, togglePopup] = getTogglePopupsState();
  const closePopup = () => {
    if (onClose) {
      onClose();
    }
    togglePopup('rideSummary', false);
  };
  useEffect(() => {
    if (closeAfter) {
      setTimeout(closePopup, closeAfter);
    }
  }, []);

  const updateRating = (rate) => {
    // alert(rate);
    setRating(rate);
  };

  const Star = (props) => {
    const source = props.isOn ? lightStarIconSource : starIconSource;
    return (
      <TouchableOpacity {...props}><StarIcon source={source} isOn={props.isOn} /></TouchableOpacity>
    );
  };

  const StarRating = (props) =>
    (
      <SummaryStars>
        <Star isOn={rating >= 1} onPress={() => updateRating(1)}/>
        <Star isOn={rating >= 2} onPress={() => updateRating(2)}/>
        <Star isOn={rating >= 3} onPress={() => updateRating(3)}/>
        <Star isOn={rating >= 4} onPress={() => updateRating(4)}/>
        <Star isOn={rating >= 5} onPress={() => updateRating(5)}/>
      </SummaryStars>
    );

  return (
    <Modal isVisible={isPopupOpen('rideSummary') || false}>
        <SummaryContainer>
          <CloseContainer onPress={() => closePopup()}>
            <ResetInputIcon />
          </CloseContainer>
          <View style={{ flex: 2, textAlign: 'left', maxWidth: '80%' }}>
            <SummaryTitle>Thanks for your ride with Mobility-on-Demand!</SummaryTitle>
            <SummarySubTitle>Your ride data</SummarySubTitle>

            <SummaryItems>
              <SummaryItem>
                <SummaryItemIcon source={durationIconSource}/>
                <SummaryItemTitle>Duration</SummaryItemTitle>
                <SummaryItemText>value</SummaryItemText>
              </SummaryItem>

              <SummaryItem>
                <SummaryItemIcon source={distanceIconSource}/>
                <SummaryItemTitle>Distance</SummaryItemTitle>
                <SummaryItemText>value</SummaryItemText>
              </SummaryItem>

              <SummaryItem last>
                <SummaryItemIcon source={priceIconSource}/>
                <SummaryItemTitle>Price</SummaryItemTitle>
                <SummaryItemText>value</SummaryItemText>
              </SummaryItem>
            </SummaryItems>

            <SummaryStarsSubTitle>How satisfied are you?</SummaryStarsSubTitle>
            <SummaryStarsTitle>Rate your ride</SummaryStarsTitle>
            <StarRating/>
            { rating ? <SummaryStarsSubTitle>We welcome your feedback</SummaryStarsSubTitle> : null}

          </View>
        </SummaryContainer>
    </Modal>
  )
}
