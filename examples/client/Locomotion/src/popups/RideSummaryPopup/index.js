import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { RidePageContext } from '../../context/ridePageContext';
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
  StarIcon,
} from './styled';
import { getTogglePopupsState } from '../../context/state';
import RoundedButton from '../../Components/RoundedButton';
import Button from '../../Components/Button';

const starIconSource = require('../../assets/star.png');
const lightStarIconSource = require('../../assets/lightStar.png');
const durationIconSource = require('../../assets/duration.png');
const distanceIconSource = require('../../assets/distance.png');
const priceIconSource = require('../../assets/price.png');

export default ({ closeAfter }) => {
  const {
    rideSummaryData,
    setRideSummaryData,
    onRating,
  } = useContext(RidePageContext);
  const onClose = () => {
    setRideSummaryData({});
  };
  const [rating, setRating] = useState(false);
  const [ratingSent, setRatingSent] = useState(false);
  const [isPopupOpen, togglePopup, popupData] = getTogglePopupsState();
  const reset = () => {
    setRating(false);
    setRatingSent(false);
  };

  const closePopup = () => {
    reset();
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
    setRating(rate);
  };

  const Star = (props) => {
    const source = props.isOn ? lightStarIconSource : starIconSource;
    return (
      <Button noBg {...props} data-test-id="RattingButton"><StarIcon source={source} isOn={props.isOn} /></Button>
    );
  };

  const StarRating = props => (
    <SummaryStars>
      <Star isOn={rating >= 1} onPress={() => updateRating(1)} />
      <Star isOn={rating >= 2} onPress={() => updateRating(2)} />
      <Star isOn={rating >= 3} onPress={() => updateRating(3)} />
      <Star isOn={rating >= 4} onPress={() => updateRating(4)} />
      <Star isOn={rating >= 5} onPress={() => updateRating(5)} />
    </SummaryStars>
  );

  const onSubmit = async () => {
    setRatingSent(false);
    if (rating) {
      await onRating(rating);
      setRatingSent(true);
      setTimeout(() => {
        closePopup();
      }, 2000);
    }
  };

  return (
    <Modal isVisible={isPopupOpen('rideSummary') || false}>
      <SummaryContainer>
        <CloseContainer onPress={() => closePopup()} data-test-id="CloseRideSummaryPopup">
          <ResetInputIcon />
        </CloseContainer>
        <View style={{ flex: 2, textAlign: 'left', maxWidth: '80%' }}>
          <SummaryTitle>{i18n.t('popups.rideSummary.thanksForRideHeadline')}</SummaryTitle>
          <SummarySubTitle>{i18n.t('popups.rideSummary.rideDataHeadline')}</SummarySubTitle>

          <SummaryItems>
            <SummaryItem>
              <SummaryItemIcon source={durationIconSource} />
              <SummaryItemTitle>{i18n.t('popups.rideSummary.durationLabel')}</SummaryItemTitle>
              <SummaryItemText>{i18n.t('popups.rideSummary.durationValue', { duration: rideSummaryData.duration })}</SummaryItemText>
            </SummaryItem>

            <SummaryItem last={!rideSummaryData.price}>
              <SummaryItemIcon source={distanceIconSource} />
              <SummaryItemTitle>{i18n.t('popups.rideSummary.distanceLabel')}</SummaryItemTitle>
              <SummaryItemText>{i18n.t('popups.rideSummary.distanceValue', { distance: (rideSummaryData.distance / 1000).toFixed(1) })}</SummaryItemText>
            </SummaryItem>

            {rideSummaryData.price !== null
              ? (
                <SummaryItem last>
                  <SummaryItemIcon source={priceIconSource} />
                  <SummaryItemTitle>{i18n.t('popups.rideSummary.priceLabel')}</SummaryItemTitle>
                  <SummaryItemText>{i18n.t('popups.rideSummary.priceValue', { price: rideSummaryData.price })}</SummaryItemText>
                </SummaryItem>
              ) : null}
          </SummaryItems>

          <SummaryStarsSubTitle>{i18n.t('popups.rideSummary.ratingPre')}</SummaryStarsSubTitle>
          <SummaryStarsTitle>{i18n.t('popups.rideSummary.ratingHeadline')}</SummaryStarsTitle>
          <StarRating />
          <RoundedButton
            data-test-id="SubmitRideSummaryPopupButton"
            onPress={() => onSubmit()}
          >
            {i18n.t('popups.rideSummary.submit')}
          </RoundedButton>
          { ratingSent ? <SummaryStarsSubTitle>{i18n.t('popups.rideSummary.ratingPost')}</SummaryStarsSubTitle> : null}

        </View>
      </SummaryContainer>
    </Modal>
  );
};
