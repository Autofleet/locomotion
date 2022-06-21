import React, { useState } from 'react';
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

const MAX_SIZE = 100;

export default ({ isVisible }) => {
  const [currentText, updateText] = useState('');
  const onSubmit = () => null;

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
                onPress={() => onSubmit()}
              >
                {i18n.t('popups.rideNotes.cancel')}
              </RoundedButton>
            </FlexCont>
            <FlexCont paddingStart={5}>
              <RoundedButton
                data-test-id="SubmitRideSummaryPopupButton2"
                onPress={() => onSubmit()}
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
