import React, { Fragment, useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import i18n from '../../I18n';
import {
  Container,
  CloseContainer,
  ResetInputIcon,
  Title,
  SubTitle,
} from './styled';
import { getTogglePopupsState } from '../../context/state';

export default ({
  closeAfter, onClose, rideSummaryData, onRating,
}) => {
  const [isPopupOpen, togglePopup, popupData] = getTogglePopupsState();
  const closePopup = () => {
    if (onClose) {
      onClose();
    }
    togglePopup('futureRideCanceled', false);
  };

  useEffect(() => {
    if (closeAfter) {
      setTimeout(closePopup, closeAfter);
    }
  }, []);

  return (
    <Modal isVisible={isPopupOpen('futureRideCanceled') || false}>
      <Container>
        <CloseContainer noBackground onPress={() => closePopup()} testID="CloseFutureRideCanceledPopup">
          <ResetInputIcon />
        </CloseContainer>
        <View style={{ flex: 2, textAlign: 'left', maxWidth: '80%' }}>
          <Title>
            {i18n.t('popups.futureRideCanceled.title')}
          </Title>
          <SubTitle>
            {i18n.t('popups.futureRideCanceled.subTitle')}
          </SubTitle>
        </View>
      </Container>
    </Modal>
  );
};
