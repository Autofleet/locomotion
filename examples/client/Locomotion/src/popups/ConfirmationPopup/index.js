import React from 'react';
import Modal from 'react-native-modal';
import propsTypes from 'prop-types';
import {
  PopupContainer,
  SummaryTitle,
  SubmitContainer,
  ContentContainer,
  Content,
} from './styled';
import RoundedButton from '../../Components/RoundedButton';

const ConfirmationPopup = ({
  title,
  text,
  confirmText,
  cancelText,
  useCancelTextButton,
  type,
  onClose,
  onSubmit,
  isVisible,
}) => {
  const closePopup = () => {
    onClose();
  };

  return (
    <Modal isVisible={isVisible}>
      <PopupContainer>
        <ContentContainer>
          <SummaryTitle>{title}</SummaryTitle>
          <Content>
            {text}
          </Content>
          <SubmitContainer>
            <RoundedButton onPress={() => onSubmit()} type={type}>{confirmText}</RoundedButton>
            <RoundedButton onPress={() => closePopup()} hollow type={type} useCancelTextButton={useCancelTextButton}>{cancelText}</RoundedButton>
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
  onClose: () => null,
};

ConfirmationPopup.propTypes = {
  title: propsTypes.string,
  text: propsTypes.string,
  confirmText: propsTypes.string,
  cancelText: propsTypes.string,
  useCancelTextButton: propsTypes.bool,
  type: propsTypes.string,
  onClose: propsTypes.func,
};
