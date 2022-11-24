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
  defualtText: string;
  secondText: string;
  onDefaultPress: any;
  onSecondPress: any;
}

const TwoButtonPopup = ({
  title,
  text,
  isVisible,
  secondText,
  onSecondPress,
  defualtText,
  onDefaultPress,
}: TwoButtonPopupProps) => (
  <Modal isVisible={isVisible}>
    <Container>
      <TextContainer>
        <Title style={{ textAlign: 'center', paddingBottom: 15 }}>{title}</Title>
        <SubTitle>{text}</SubTitle>
      </TextContainer>
      <ButtonContainer>
        <RoundedButton onPress={onDefaultPress} style={{ marginBottom: 10 }}>
          {defualtText}
        </RoundedButton>
        <RoundedButton onPress={onSecondPress} hollow>
          {secondText}
        </RoundedButton>
      </ButtonContainer>
    </Container>
  </Modal>
);

export default TwoButtonPopup;
