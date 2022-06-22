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
  const [currentText, updateText] = useState(ride.notes || '');

  return (
    <Modal isVisible={isVisible}>
      <SummaryContainer>
        <View style={{ flex: 2, textAlign: 'left', width: '80%' }}>
          <FlexCont justifyContent="space-between">
            <View>
              <Title>{i18n.t('popups.rideNotes.title')}</Title>
            </View>
            <View>
              <Counter>{`${currentText.length}/${MAX_SIZE}`}</Counter>
            </View>
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
            <FlexCont paddingEnd={5}>
              <RoundedButton
                width="100%"
                hollow
                data-test-id="SubmitRideSummaryPopupButton"
                onPress={() => onCancel()}
              >
                {i18n.t('popups.rideNotes.cancel')}
              </RoundedButton>
            </FlexCont>
            <FlexCont paddingStart={5}>
              <RoundedButton
                data-test-id="SubmitRideSummaryPopupButton2"
                onPress={() => onSubmit(currentText)}
              >
                {i18n.t('popups.rideNotes.save')}
              </RoundedButton>
            </FlexCont>
          </FlexCont>
        </View>
      </SummaryContainer>
    </Modal>
  );
};
