import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { KeyboardAvoidingView, SafeAreaView } from 'react-native';
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

const MAX_SIZE = 100;

export default ({
  isVisible, onSubmit, onCancel, notes,
}) => {
  const [currentText, updateText] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    updateText(notes || '');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  return (
    <Modal isVisible={isVisible}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <SafeAreaView>
          <SummaryContainer>
            <FlexCont justifyContent="space-between">
              <Title>{i18n.t('popups.rideNotes.title')}</Title>
              <Counter>{`${currentText.length}/${MAX_SIZE}`}</Counter>
            </FlexCont>
            <StyledTextArea
              ref={inputRef}
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
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};
