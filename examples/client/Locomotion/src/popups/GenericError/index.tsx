import React, { SetStateAction } from 'react';
import Modal from 'react-native-modal';
import SvgIcon from '../../Components/SvgIcon';
import { SubTitle, Title } from '../styled';
import i18n from '../../I18n';
import errorIcon from '../../assets/error-icon.svg';
import {
  ButtonText, CloseButton, Container, TextContainer, TitleContainer,
} from './styles';

interface GenericErrorProps {
  isVisible: boolean;
  closePopup: any | SetStateAction<boolean>;
  title?: string;
  text?: string;
  buttonText?: string
}

const GenericErrorPopup = ({
  isVisible,
  closePopup,
  title,
  text,
  buttonText,
}: GenericErrorProps) => (
  <Modal isVisible={isVisible}>
    <Container>
      <TitleContainer>
        <SvgIcon Svg={errorIcon} height={20} width={20} style={{ marginRight: 5 }} />
        <Title>{title}</Title>
      </TitleContainer>
      <TextContainer>
        <SubTitle>{text}</SubTitle>
      </TextContainer>
      <CloseButton onPress={closePopup}>
        <ButtonText>
          {buttonText}
        </ButtonText>
      </CloseButton>
    </Container>
  </Modal>
);

GenericErrorPopup.defaultProps = {
  title: i18n.t('popups.genericError.title'),
  text: i18n.t('popups.genericError.text'),
  buttonText: i18n.t('popups.genericError.buttonText'),
};
export default GenericErrorPopup;
