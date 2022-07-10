import React from 'react';
import Modal from 'react-native-modal';
import RoundedButton from '../../Components/RoundedButton';
import { SubTitle, Title } from '../styled';
import i18n from '../../I18n';
import {
  Container, ButtonContainer, TextContainer,
} from './styled';

interface RideCanceledProps {
  isVisible: boolean;
  onCancel: any;
  onBackToOrder: any;
}

const RideCanceledPopup = ({
  isVisible,
  onCancel,
  onBackToOrder,
}: RideCanceledProps) => (
  <Modal isVisible={isVisible}>
    <Container>
      <TextContainer>
        <Title>{i18n.t('popups.rideCanceled.title')}</Title>
        <SubTitle>{i18n.t('popups.rideCanceled.text')}</SubTitle>
      </TextContainer>
      <ButtonContainer>
        <RoundedButton onPress={onBackToOrder} style={{ marginBottom: 10 }}>
          {i18n.t('popups.rideCanceled.buttonText')}
        </RoundedButton>
        <RoundedButton onPress={onCancel} hollow>
          {i18n.t('popups.rideCanceled.closeButtonText')}
        </RoundedButton>
      </ButtonContainer>
    </Container>
  </Modal>
);

export default RideCanceledPopup;
