import React, { useEffect } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import Modal from '../Components/CompatModal';
import {
  ModalContainer, Content, FooterButton, Title, SubTitle,
} from './styled';
import { getTogglePopupsState } from '../context/state';

export default function ({
  id, title, subTitle, closeAfter, content, onClose,
}) {
  const [isPopupOpen, togglePopup] = getTogglePopupsState();
  const closePopup = () => {
    if (onClose) {
      onClose();
    }
    togglePopup(id, false);
  };
  useEffect(() => {
    if (closeAfter) {
      setTimeout(closePopup, closeAfter);
    }
  }, []);

  return (
    <Modal isVisible={isPopupOpen(id) || false}>
      <KeyboardAvoidingView style={{ justifyContent: 'flex-end' }} behavior="padding">
        <ModalContainer>
          <Content>
            <Title>{title}</Title>
            <SubTitle>{subTitle}</SubTitle>
            {content || undefined}
          </Content>
          <FooterButton onPress={closePopup} testID="PopupFooterButton" />
        </ModalContainer>
      </KeyboardAvoidingView>
    </Modal>
  );
}
