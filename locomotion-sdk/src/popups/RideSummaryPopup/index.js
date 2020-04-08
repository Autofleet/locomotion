import React, {Fragment, useEffect, useState} from 'react';
import { View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import i18n from '../../I18n';
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
                  closeAfter, onClose,rideSummaryData, onRating
                }) => {
                  console.log(rideSummaryData);

  const [rating, setRating] = useState(false);
  const [isPopupOpen, togglePopup, popupData] = getTogglePopupsState();
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

  const updateRating = async (rate) => {
    await onRating(rate)
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
            <SummaryTitle>{i18n.t('popups.rideSummary.thanksForRideHeadline')}</SummaryTitle>
            <SummarySubTitle>{i18n.t('popups.rideSummary.rideDataHeadline')}</SummarySubTitle>

            <SummaryItems>
              <SummaryItem>
                <SummaryItemIcon source={durationIconSource}/>
                <SummaryItemTitle>{i18n.t('popups.rideSummary.durationLabel')}</SummaryItemTitle>
                <SummaryItemText>{i18n.t('popups.rideSummary.durationValue', {duration: rideSummaryData.duration})}</SummaryItemText>
              </SummaryItem>

              <SummaryItem last={!rideSummaryData.price}>
                <SummaryItemIcon source={distanceIconSource}/>
                <SummaryItemTitle>{i18n.t('popups.rideSummary.distanceLabel')}</SummaryItemTitle>
                <SummaryItemText>{i18n.t('popups.rideSummary.distanceValue', {distance: (rideSummaryData.distance / 1000).toFixed(1)})}</SummaryItemText>
              </SummaryItem>

            {rideSummaryData.price ?
              <SummaryItem last>
                <SummaryItemIcon source={priceIconSource}/>
                <SummaryItemTitle>{i18n.t('popups.rideSummary.priceLabel')}</SummaryItemTitle>
                <SummaryItemText>{i18n.t('popups.rideSummary.priceValue', {price: rideSummaryData.price})}</SummaryItemText>
              </SummaryItem> : null}
            </SummaryItems>

            <SummaryStarsSubTitle>{i18n.t('popups.rideSummary.ratingPre')}</SummaryStarsSubTitle>
            <SummaryStarsTitle>{i18n.t('popups.rideSummary.ratingHeadline')}</SummaryStarsTitle>
            <StarRating/>
            { rating ? <SummaryStarsSubTitle>{i18n.t('popups.rideSummary.ratingPost')}</SummaryStarsSubTitle> : null}

          </View>
        </SummaryContainer>
    </Modal>
  )
}
