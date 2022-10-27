import React, { useEffect } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import Modal from 'react-native-modal';
import {
  ModalContainer, Content, FooterButton, Title,
} from './styled';
import { getTogglePopupsState } from '../../context/state';
import Loader from '../../Components/Loader';

export default ({
  id, title, closeAfter, onClose, isVisible, ...props
}) => {
  // const [isPopupOpen, togglePopup] = getTogglePopupsState();
  const closePopup = () => {
    if (onClose) {
      onClose();
    }
    // togglePopup(id, false);
  };
  useEffect(() => {
    if (closeAfter) {
      setTimeout(closePopup, closeAfter);
    }
  }, []);

  return (
    <Modal isVisible={isVisible} style={{ paddingTop: '50%', paddingBottom: '50%' }} {...props}>
      <ModalContainer>
        <Content>
          <Title>{title || 'Processing...'}</Title>
          <Loader
            lottieViewStyle={{
              height: 15, width: 15,
            }}
            dark
          />
        </Content>
      </ModalContainer>
    </Modal>
  );
};
