import React, {Fragment, useEffect, useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Modal from 'react-native-modal';
import propsTypes from 'prop-types';
import i18n from '../../I18n';
import {
  PopupContainer,
  SummaryTitle,
  CloseContainer,
  ResetInputIcon,
  SubmitContainer,
  ContentContainer,
  Content,
} from './styled';
import {getTogglePopupsState} from '../../context/state';
import RoundedButton from '../../Components/RoundedButton';

const ConfirmationPopup = ({
  name,
  title,
  text,
  confirmText,
  cancelText,
  useCancelTextButton,
  type,
  closeAfter,
  onClose,
  onSubmit,
}) => {
  const [isPopupOpen, togglePopup, popupData] = getTogglePopupsState();

  const closePopup = () => {
    if (onClose) {
      onClose();
    }
    togglePopup(name, false);
  };

  useEffect(() => {
    if (closeAfter) {
      setTimeout(closePopup, closeAfter);
    }
  }, []);

  return (
    <Modal isVisible={isPopupOpen(name)}>
      <PopupContainer>
        <ContentContainer>
          <SummaryTitle>{title}</SummaryTitle>
          <Content>{text}</Content>
          <SubmitContainer>
            <RoundedButton onPress={() => onSubmit()} type={type}>
              {confirmText}
            </RoundedButton>
            <RoundedButton
              onPress={() => closePopup()}
              hollow
              type={type}
              useCancelTextButton={useCancelTextButton}>
              {cancelText}
            </RoundedButton>
          </SubmitContainer>
        </ContentContainer>
      </PopupContainer>
    </Modal>
  );
};

export default ConfirmationPopup;

ConfirmationPopup.defaultProps = {
  title: 'Confirmation Popup',
  text: '',
  confirmText: 'Submit',
  cancelText: 'Cancel',
  useCancelTextButton: false,
  type: 'confirm',
  closeAfter: null,
  onClose: () => {},
};

ConfirmationPopup.propTypes = {
  title: propsTypes.string,
  text: propsTypes.string,
  confirmText: propsTypes.string,
  cancelText: propsTypes.string,
  useCancelTextButton: propsTypes.bool,
  type: propsTypes.string,
  closeAfter: propsTypes.number,
  onClose: propsTypes.func,
};
