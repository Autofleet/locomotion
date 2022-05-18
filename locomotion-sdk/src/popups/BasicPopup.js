import React, { useEffect } from 'react';
import Modal from 'react-native-modal';
import {
  ModalContainer, Content, FooterButton, Title, SubTitle,
} from './styled';
import { getTogglePopupsState } from '../context/main';

export default ({
  id, title, subTitle, closeAfter, content, onClose,
}) => {
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
      <ModalContainer>
        <Content>
          <Title>{title}</Title>
          <SubTitle>{subTitle}</SubTitle>
          {content || undefined}
        </Content>
        <FooterButton onPress={closePopup} data-test-id="PopupFooterButton" />
      </ModalContainer>
    </Modal>
  );
};
