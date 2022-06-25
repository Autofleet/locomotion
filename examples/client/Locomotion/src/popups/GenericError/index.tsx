import React, { SetStateAction } from 'react';
import Modal from 'react-native-modal';
import SvgIcon from '../../Components/SvgIcon';
import { SubTitle, Title } from '../styled';
import i18n from '../../I18n';
import errorIcon from '../../assets/error-icon.svg';
import {
  ButtonText, CloseButton, Container, TextContainer, TitleContainer,
} from './styles';

export default ({ isVisible, closePopup }:
    { isVisible: boolean, closePopup: SetStateAction<any> }) => (
      <Modal isVisible={isVisible}>
        <Container>
          <TitleContainer>
            <SvgIcon Svg={errorIcon} height={20} width={20} style={{ marginRight: 5 }} />
            <Title>{i18n.t('popups.genericError.title')}</Title>
          </TitleContainer>
          <TextContainer>
            <SubTitle>{i18n.t('popups.genericError.text')}</SubTitle>
          </TextContainer>
          <CloseButton onPress={closePopup}>
            <ButtonText>
              {i18n.t('popups.genericError.buttonText')}
            </ButtonText>
          </CloseButton>
        </Container>
      </Modal>
);
