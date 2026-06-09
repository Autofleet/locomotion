import React, {
  useEffect, useRef, useState, useContext,
} from 'react';
import {
  BackHandler, Platform, Pressable, StatusBar, StyleSheet, View,
} from 'react-native';
import { Portal } from '@gorhom/portal';
import { ThemeContext } from 'styled-components';
import i18n from '../../I18n';
import {
  SummaryContainer,
  Title,
  StyledTextArea,
  Counter,
} from './styled';
import RoundedButton from '../../Components/RoundedButton';
import { FlexCont } from '../../Components/Flex';

const MAX_SIZE = 150;

export default ({
  isVisible, onSubmit, onCancel, notes,
}) => {
  const [currentText, updateText] = useState('');
  const inputRef = useRef();
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (!isVisible) return undefined;
    updateText(notes || '');
    const t = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(t);
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onCancel();
      return true;
    });
    return () => sub.remove();
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Portal>
      <View style={styles.fill} pointerEvents="box-none">
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View style={styles.topAnchor} pointerEvents="box-none">
          <SummaryContainer>
              <FlexCont justifyContent="space-between">
                <Title>{i18n.t('popups.rideNotes.title')}</Title>
                <Counter>{`${currentText.length}/${MAX_SIZE}`}</Counter>
              </FlexCont>
              <StyledTextArea
                autoFocus={false}
                ref={inputRef}
                value={currentText}
                multiline
                numberOfLines={7}
                testID="notesInput"
                textAlignVertical="top"
                placeholder={i18n.t('popups.rideNotes.placeholder')}
                maxLength={MAX_SIZE}
                onChangeText={updateText}
                placeholderTextColor={theme.disabledColor}
              />
              <FlexCont>
                <RoundedButton
                  width="48%"
                  hollow
                  testID="CancelRideNotes"
                  onPress={() => onCancel()}
                >
                  {i18n.t('popups.rideNotes.cancel')}
                </RoundedButton>
                <RoundedButton
                  width="48%"
                  testID="SubmitRideNotes"
                  onPress={() => onSubmit(currentText)}
                >
                  {i18n.t('popups.rideNotes.save')}
                </RoundedButton>
              </FlexCont>
          </SummaryContainer>
        </View>
      </View>
    </Portal>
  );
};

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44;

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  topAnchor: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 8,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
  },
});
