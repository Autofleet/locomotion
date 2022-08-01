import React, { SetStateAction } from 'react';
import Modal from 'react-native-modal';
import Config from 'react-native-config';
import { SubTitle, Title } from '../styled';
import i18n from '../../I18n';
import {
  ButtonText, CloseButton, Container, TextContainer, TitleContainer,
} from './styles';

interface TempraryHoldLearnMoreProps {
  isVisible: boolean;
  closePopup: any | SetStateAction<boolean>;
}

const TempraryHoldLearnMorePopup = ({
  isVisible,
  closePopup,

}: TempraryHoldLearnMoreProps) => (
  <Modal isVisible={isVisible}>
    <Container>
      <TitleContainer>
        <Title>{i18n.t('temporaryHoldPopup.title')}</Title>
      </TitleContainer>
      <TextContainer>
        <SubTitle>
          {i18n.t('temporaryHoldPopup.text', { appName: Config.OPERATION_NAME })}

        </SubTitle>
      </TextContainer>
      <CloseButton onPress={closePopup}>
        <ButtonText>
          {`${i18n.t('temporaryHoldPopup.buttonText')}`}
        </ButtonText>
      </CloseButton>
    </Container>
  </Modal>
);
export default TempraryHoldLearnMorePopup;
