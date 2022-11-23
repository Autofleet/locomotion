import React from 'react';
import Modal from 'react-native-modal';
import RoundedButton from '../../Components/RoundedButton';
import { SubTitle, Title } from '../styled';
import {
  Container, ButtonContainer, TextContainer,
} from './styled';

interface TwoButtonPopupProps {
  title: string;
  text: string;
  isVisible: boolean;
  cancelText: string;
  submitText: string;
  onCancel: any;
  onSubmit: any;
}

const TwoButtonPopup = ({
  title,
  text,
  isVisible,
  cancelText,
  onCancel,
  submitText,
  onSubmit,
}: TwoButtonPopupProps) => (
  <Modal isVisible={isVisible}>
    <Container>
      <TextContainer>
        <Title style={{ textAlign: 'center', paddingBottom: 15 }}>{title}</Title>
        <SubTitle>{text}</SubTitle>
      </TextContainer>
      <ButtonContainer>
        <RoundedButton onPress={onSubmit} style={{ marginBottom: 10 }}>
          {submitText}
        </RoundedButton>
        <RoundedButton onPress={onCancel} hollow>
          {cancelText}
        </RoundedButton>
      </ButtonContainer>
    </Container>
  </Modal>
);

export default TwoButtonPopup;
