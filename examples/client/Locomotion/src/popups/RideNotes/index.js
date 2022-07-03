import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import i18n from '../../I18n';
import {
  SummaryContainer,
  Title,
  StyledTextArea,
  Counter,
} from './styled';
import RoundedButton from '../../Components/RoundedButton';
import { FlexCont } from '../../Components/Flex';
import { RidePageContext } from '../../context/newRideContext';

const MAX_SIZE = 100;

export default ({ isVisible, onSubmit, onCancel }) => {
  const {
    ride,
  } = useContext(RidePageContext);
  const [currentText, updateText] = useState('');

  useEffect(() => {
    updateText(ride.notes || '');
  }, [isVisible]);

  return (
    <Modal isVisible={isVisible}>
      <SummaryContainer>
        <FlexCont justifyContent="space-between">
          <Title>{i18n.t('popups.rideNotes.title')}</Title>
          <Counter>{`${currentText.length}/${MAX_SIZE}`}</Counter>
        </FlexCont>
        <StyledTextArea
          value={currentText}
          multiline
          numberOfLines={7}
          textAlignVertical="top"
          placeholder={i18n.t('popups.rideNotes.placeholder')}
          maxLength={MAX_SIZE}
          onChangeText={updateText}
        />
        <FlexCont>
          <RoundedButton
            width="48%"
            hollow
            data-test-id="SubmitRideSummaryPopupButton"
            onPress={() => onCancel()}
          >
            {i18n.t('popups.rideNotes.cancel')}
          </RoundedButton>
          <RoundedButton
            width="48%"
            data-test-id="SubmitRideSummaryPopupButton2"
            onPress={() => onSubmit(currentText)}
          >
            {i18n.t('popups.rideNotes.save')}
          </RoundedButton>
        </FlexCont>
      </SummaryContainer>
    </Modal>
  );
};
