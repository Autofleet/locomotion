import React, { SetStateAction } from 'react';
import Modal from 'react-native-modal';
import SvgIcon from '../../Components/SvgIcon';
import { SubTitle, Title } from '../styled';
import i18n from '../../I18n';

import {
  ButtonText, CloseButton, Container, TextContainer, TitleContainer,
} from './styles';

interface GenericProps {
  isVisible: boolean;
  closePopup: any | SetStateAction<boolean>;
  title?: string;
  text?: string;
  buttonText?: string;
  buttonColor?: string;
  customButton?: any;
  icon?: any;
  iconFill?: string
}

const GenericPopup = ({
  isVisible,
  closePopup,
  title,
  text,
  buttonText,
  buttonColor,
  customButton,
  icon,
  iconFill,
}: GenericProps) => (
  <Modal isVisible={isVisible}>
    <Container>
      <TitleContainer>
        {icon ? (
          <SvgIcon Svg={icon} fill="black" height={20} width={20} style={{ marginRight: 5 }} />
        ) : null}
        <Title>{title}</Title>
      </TitleContainer>
      <TextContainer>
        <SubTitle>{text}</SubTitle>
      </TextContainer>
      {customButton || (
      <CloseButton onPress={closePopup} style={{ backgroundColor: buttonColor || '#24aaf2' }}>
        <ButtonText>
          {buttonText}
        </ButtonText>
      </CloseButton>
      )}
    </Container>
  </Modal>
);

GenericPopup.defaultProps = {
  title: i18n.t('popups.genericError.title'),
  text: i18n.t('popups.genericError.text'),
  buttonText: i18n.t('popups.genericError.buttonText'),
  buttonColor: null,
  customButton: null,
  icon: null,
  iconFill: null,
};
export default GenericPopup;
