import React from 'react';
import propsTypes from 'prop-types';
import Modal from '../../Components/CompatModal';
import {
  PopupContainer,
  SummaryTitle,
  SubmitContainer,
  ContentContainer,
  Content,
} from './styled';
import RoundedButton from '../../Components/RoundedButton';

const ConfirmationPopup = ({
  title = 'Confirmation Popup',
  text = '',
  confirmText = 'Submit',
  cancelText = 'Cancel',
  useCancelTextButton = false,
  type = 'confirm',
  onClose = () => undefined,
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
            <RoundedButton testID="confirm" onPress={() => onSubmit()} type={type}>{confirmText}</RoundedButton>
            <RoundedButton testID="cancel" onPress={() => closePopup()} hollow type={type} useCancelTextButton={useCancelTextButton}>{cancelText}</RoundedButton>
          </SubmitContainer>
        </ContentContainer>
      </PopupContainer>
    </Modal>
  );
};

export default ConfirmationPopup;

ConfirmationPopup.propTypes = {
  title: propsTypes.string,
  text: propsTypes.string,
  confirmText: propsTypes.string,
  cancelText: propsTypes.string,
  useCancelTextButton: propsTypes.bool,
  type: propsTypes.string,
  onClose: propsTypes.func,
};
