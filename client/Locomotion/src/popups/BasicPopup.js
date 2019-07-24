import React, { useEffect } from 'react';
import Modal from 'react-native-modal';
import {
  ModalContainer, Content, FooterButton, Title, SubTitle,
} from './styled';
import { getTogglePopupsState } from '../context/main';

export default ({
  id, title, subTitle, closeAfter,
}) => {
  const [isPopupOpen, togglePopup] = getTogglePopupsState();
  const closePopup = () => togglePopup(id, false);
  useEffect(() => {
    if (closeAfter) {
      setTimeout(closePopup, closeAfter);
    }
  });

  return (
    <Modal isVisible={isPopupOpen(id) || false}>
      <ModalContainer>
        <Content>
          <Title>{title}</Title>
          <SubTitle>{subTitle}</SubTitle>
        </Content>
        <FooterButton onPress={closePopup} />
      </ModalContainer>
    </Modal>
  );
};
